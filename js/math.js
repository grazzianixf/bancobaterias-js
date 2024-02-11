function nextInteger(n) {
    let integer = Math.trunc(n);

    if (n > integer) {
        return ++integer
    }

    return integer
}