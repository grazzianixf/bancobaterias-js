class BancoBateria {
    static PERDA_INVERSOR_DEFAULT = 10;
    static PERDA_BATERIA_DEFAULT = 10;
    static MAX_DESCARGA_BATERIA_DEFAULT = 30;
    static TENSAO_DEFAULT = 12;

    #txPerdaBateria =  BancoBateria.PERDA_BATERIA_DEFAULT;
    #txPerdaInversor = BancoBateria.PERDA_INVERSOR_DEFAULT;
    #dias = 1;
    #txMaxDescargaBateria = BancoBateria.MAX_DESCARGA_BATERIA_DEFAULT;
    #tensao = BancoBateria.TENSAO_DEFAULT;
    #capacidadeBateriaUtilizada = 0;
    #txAumentoCapacidade = 0;
    #resultado = {};

    constructor(values = [{ potencia: 0, qtd: 0, horas: 0 }]) {
        this.values = values
    }

    get txPerdaBateria() {
        return this.#txPerdaBateria;
    }

    set txPerdaBateria(txPerdaBateria) {
        this.#txPerdaBateria = txPerdaBateria;
    }    

    get txPerdaInversor() {
        return this.#txPerdaInversor;
    }

    set txPerdaInversor(txPerdaInversor) {
        this.#txPerdaInversor = txPerdaInversor;
    }  
    
    get dias() {
        return this.#dias;
    }

    set dias(dias) {
        this.#dias = dias;
    }     

    get txMaxDescargaBateria() {
        return this.#txMaxDescargaBateria;
    }

    set txMaxDescargaBateria(txMaxDescargaBateria) {
        this.#txMaxDescargaBateria = txMaxDescargaBateria;
    }
    
    get tensao() {
        return this.#tensao;
    }
    
    set tensao(tensao) {
        this.#tensao = tensao;
    }

    get capacidadeBateriaUtilizada() {
        return this.#capacidadeBateriaUtilizada;
    }
    
    set capacidadeBateriaUtilizada(capacidadeBateriaUtilizada) {
        this.#capacidadeBateriaUtilizada = capacidadeBateriaUtilizada;
    }

    get txAumentoCapacidade() {
        return this.#txAumentoCapacidade;
    }
    
    #atualizarAumentoCapacidade(txAumentoCapacidade) {
        this.#txAumentoCapacidade = txAumentoCapacidade;
    }

    get resultado() {
        return this.#resultado;
    }
    
    #atualizarResultado(resultado) {
        this.#resultado = resultado;
    }

    // get e set calculados
    #total(fieldName) {
        return this.values.reduce((acc, e) => acc + e[fieldName], 0);
    }

    get energiaConsumida() {
        return this.#total('energiaConsumida');
    }

    get energiaConsumidaPeriodo() {
        return this.#total('energiaConsumidaPeriodo');
    }

    get energiaArmazenadaBancoBaterias() {
        return this.#total('energiaArmazenadaBancoBaterias');
    }
    
    get energiaArmazenadaBancoBateriasPeriodo() {
        return this.#total('energiaArmazenadaBancoBateriasPeriodo');
    }    

    get capacidadeBancoBaterias() {
        return this.#total('capacidadeBancoBaterias');
    } 
    
    get capacidadeBancoBateriasPeriodo() {
        return this.#total('capacidadeBancoBateriasPeriodo');
    }

    //--
    calcularAutonomia() {
        this.values.forEach(e => {
            this.atualizarEnergiaConsumida(e);
            this.atualizarEnergiaArmazenadaBancoBaterias(e);
            this.atualizarCapacidadeBancoBaterias(e);            
        });

        this.atualizarQuantidadeBaterias();

        this.values.forEach(e => this.atualizarTempoAutonomia(e));
    }

    obterEnergiaConsumida(potencia, qtd, horas) {
        return potencia * qtd * horas / ( (1-this.txPerdaBateria/100) * (1-this.txPerdaInversor/100))
    }

    atualizarEnergiaConsumida(e) {
        let energiaConsumida = this.obterEnergiaConsumida(e.potencia, e.qtd, e.horas) || 0;
        e.energiaConsumida = energiaConsumida;
        e.energiaConsumidaPeriodo = energiaConsumida * this.dias;
    }

    atualizarEnergiaArmazenadaBancoBaterias(e) {
        e.energiaArmazenadaBancoBaterias = e.energiaConsumida / (this.txMaxDescargaBateria / 100)
        e.energiaArmazenadaBancoBateriasPeriodo = e.energiaConsumidaPeriodo / (this.txMaxDescargaBateria / 100)
    }

    atualizarCapacidadeBancoBaterias(e) {
        e.capacidadeBancoBaterias = e.energiaArmazenadaBancoBaterias / this.tensao;
        e.capacidadeBancoBateriasPeriodo = e.energiaArmazenadaBancoBateriasPeriodo / this.tensao;        
    }

    atualizarQuantidadeBaterias() {
        let capacidadeBancoBaterias = this.capacidadeBancoBateriasPeriodo
        let numeroBrutoBaterias = capacidadeBancoBaterias / this.capacidadeBateriaUtilizada;
        let numeroLiquidoBaterias = nextInteger(numeroBrutoBaterias);

        let capacidadeBancoBateriasAtualizado = numeroLiquidoBaterias * this.capacidadeBateriaUtilizada;

        this.#atualizarAumentoCapacidade(capacidadeBancoBateriasAtualizado / capacidadeBancoBaterias);

        this.#atualizarResultado({
            numeroBrutoBaterias,
            numeroLiquidoBaterias,
            observacao: `Usando ${nextInteger(numeroBrutoBaterias)} bateria(s) ${this.tensao}V de ${this.capacidadeBateriaUtilizada}Ah o banco de baterias aumenta para ${capacidadeBancoBateriasAtualizado}Ah`
        });
    }

    atualizarTempoAutonomia(e) {
        e.horasAtualizado = e.horas * this.txAumentoCapacidade;
    }    

}


