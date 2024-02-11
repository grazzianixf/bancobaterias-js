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
    
    //--

    obterEnergiaConsumida(potencia, qtd, horas) {
        return potencia * qtd * horas / ( (1-this.txPerdaBateria/100) * (1-this.txPerdaInversor/100))
    }

    obterEnergiaConsumidaPeriodo() {
        let totalEnergiaConsumidaPeriodo = 0;

        this.values.forEach(e => {
            let energiaConsumida = this.obterEnergiaConsumida(e.potencia, e.qtd, e.horas) || 0;
            e.energiaConsumida = energiaConsumida;
            e.energiaConsumidaPeriodo = energiaConsumida * this.dias;

            totalEnergiaConsumidaPeriodo += e.energiaConsumidaPeriodo;
        })

        return totalEnergiaConsumidaPeriodo;
    }

    obterEnergiaArmazenadaBancoBaterias() {
        this.values.forEach(e => {
            e.energiaArmazenadaBancoBaterias = e.energiaConsumida / (this.txMaxDescargaBateria / 100)
            e.energiaArmazenadaBancoBateriasPeriodo = e.energiaConsumidaPeriodo / (this.txMaxDescargaBateria / 100)
        })

        return this.values.reduce((acc, v) => acc + v.energiaArmazenadaBancoBateriasPeriodo, 0)
    }

    obterCapacidadeBancoBaterias() {
        this.values.forEach(e => {
            e.capacidadeBancoBaterias = e.energiaArmazenadaBancoBaterias / this.tensao;
            e.capacidadeBancoBateriasPeriodo = e.energiaArmazenadaBancoBateriasPeriodo / this.tensao;
        })

        return this.values.reduce((acc, e) => acc + e.capacidadeBancoBateriasPeriodo, 0);
    }

    atualizarHoras(txAumentoCapacidade) {
        this.values.forEach(e => {
            e.horasAtualizado = e.horas * txAumentoCapacidade;
        })
    }

    obterQuantidadeBaterias() {
        let capacidadeBancoBaterias = this.obterCapacidadeBancoBaterias();
        let numeroBrutoBaterias = capacidadeBancoBaterias / this.capacidadeBateriaUtilizada;
        let numeroLiquidoBaterias = nextInteger(numeroBrutoBaterias);

        let capacidadeBancoBateriasAtualizado = numeroLiquidoBaterias * this.capacidadeBateriaUtilizada;
        let txAumentoCapacidade = capacidadeBancoBateriasAtualizado / capacidadeBancoBaterias

        this.atualizarHoras(txAumentoCapacidade);

        return {
            numeroBrutoBaterias,
            numeroLiquidoBaterias,
            observacao: `Usando ${nextInteger(numeroBrutoBaterias)} bateria(s) ${this.tensao}V de ${this.capacidadeBateriaUtilizada}Ah o banco de baterias aumenta para ${capacidadeBancoBateriasAtualizado}Ah`
        };
    }
}


