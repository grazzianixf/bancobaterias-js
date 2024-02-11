function getText(textName, value) {
    let text = document.createElement("input")
    text.setAttribute("type", "text")
    text.setAttribute("id", textName)
    if (value !== undefined) {
        text.setAttribute("value", value)
    }

    return text
}