function calcularAltura() {
    const genero = document.getElementById('genero').value;
    const idade = parseInt(document.getElementById('idade').value);
    const tibia = parseFloat(document.getElementById('tibia').value);
    let altura;
    
    if (isNaN(idade) || idade <= 0 || isNaN(tibia) || tibia <= 0) {
        document.getElementById('resultado-altura').innerText = "Por favor, insira valores válidos.";
        return;
    }
    
    if (genero === "masculino") {
        altura = ((2.03 * tibia) - (0.04 * idade)) + 64.19;
    } else {
        altura = ((1.83 * tibia) - (0.24 * idade) + 84.88);
    }
    
    document.getElementById('resultado-altura').innerText = `Altura estimada: ${altura.toFixed(2)} cm`;
}

function calcularPeso() {
    const genero = document.getElementById('genero').value;
    const braco = parseFloat(document.getElementById('braco').value);
    const panturrilha = parseFloat(document.getElementById('panturrilha').value);
    let peso;
    
    if (isNaN(braco) || braco <= 0 || isNaN(panturrilha) || panturrilha <= 0) {
        document.getElementById('resultado-peso').innerText = "Por favor, insira valores válidos.";
        return;
    }
    
    if (genero === "masculino") {
        peso = (0.98 * braco) + (1.16 * panturrilha) + 1.73;
    } else {
        peso = (1.09 * braco) + (1.50 * panturrilha) - 3.32;
    }
    
    document.getElementById('resultado-peso').innerText = `Peso estimado: ${peso.toFixed(2)} kg`;
}
