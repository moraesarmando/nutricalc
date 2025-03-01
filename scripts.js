function calcularPesoAJCB() {
  const idade = parseInt(document.getElementById('idade').value);
  const genero = document.getElementById('genero1').value;
  const etnia = document.getElementById('etnia').value;
  const aj = parseFloat(document.getElementById('aj').value);
  const cb = parseFloat(document.getElementById('cb').value);
  let peso;

  if (isNaN(idade) || idade <= 0 || isNaN(aj) || aj <= 0 || isNaN(cb) || cb <= 0) {
      document.getElementById('resultado-peso-ajcb').innerText = "Por favor, insira valores válidos.";
      return;
  }

  if (idade >= 18 && idade <= 60) {
      if (genero === "masculino") {
          if (etnia === "branco") {
              peso = (aj * 1.19) + (cb * 3.21) - 86.82;
          } else {
              peso = (aj * 1.09) + (cb * 3.14) - 83.72;
          }
      } else {
          if (etnia === "branco") {
              peso = (aj * 1.01) + (cb * 2.81) - 60.04;
          } else {
              peso = (aj * 1.24) + (cb * 2.97) - 82.48;
          }
      }
  } else if (idade > 60) {
      if (genero === "masculino") {
          if (etnia === "branco") {
              peso = (aj * 1.10) + (cb * 3.07) - 75.81;
          } else {
              peso = (aj * 0.44) + (cb * 2.86) - 39.21;
          }
      } else {
          if (etnia === "branco") {
              peso = (aj * 1.09) + (cb * 2.68) - 65.51;
          } else {
              peso = (aj * 1.50) + (cb * 2.58) - 84.22;
          }
      }
  } else {
      document.getElementById('resultado-peso-ajcb').innerText = "Idade fora da faixa de cálculo.";
      return;
  }

  document.getElementById('resultado-peso-ajcb').innerText = `Peso estimado: ${peso.toFixed(2)} kg`;
}

function calcularAlturaEstimada() {
    const idade = parseInt(document.getElementById('idade').value);
    const genero = document.getElementById('genero1').value;
    const etnia = document.getElementById('etnia').value;
    const aj = parseFloat(document.getElementById('aj').value);
    let altura;
  
    if (isNaN(idade) || idade <= 0 || isNaN(aj) || aj <= 0) {
        document.getElementById('resultado-altura-estimada').innerText = "Por favor, insira valores válidos.";
        return;
    }
  
    if (idade >= 18 && idade <= 60) {
        if (genero === "masculino") {
            if (etnia === "branco") {
                altura = 71.85 + (aj * 1.88);
            } else {
                altura = 73.42 + (aj * 1.79);
            }
        } else {
            if (etnia === "branco") {
                altura =  70.25 + (aj * 1.87) - (idade * 0.06);
            } else {
                altura =  68.10 + (aj * 1.87) - (idade * 0.06);
            }
        }
    } else if (idade > 60) {
        if (genero === "masculino") {
            altura =  64.19 + (aj * 2.04) - (idade * 0.04);
        } else {
            altura =  84.88 + (aj * 1.83) - (idade * 0.24);
        }
    } else {
        document.getElementById('resultado-altura-estimada').innerText = "Idade fora da faixa de cálculo.";
        return;
    }
  
    document.getElementById('resultado-altura-estimada').innerText = `altura estimado: ${altura.toFixed(2)} cm`;
  }