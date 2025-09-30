const CAMPOS_LABEL = {
    idade: 'uma idade válida (18 anos ou mais)',
    aj: 'a altura do joelho (em centímetros)',
    cb: 'a circunferência do braço (em centímetros)'
};

/**
 * Coeficientes originais das equações de Chumlea et al. (1988).
 * Foram verificados com as fórmulas presentes na pasta "calc".
 */
const PESO_CHUMLEA = {
    adulto: {
        masculino: {
            branco: { aj: 1.19, cb: 3.21, intercepto: -86.82 },
            negro: { aj: 1.09, cb: 3.14, intercepto: -83.72 }
        },
        feminino: {
            branco: { aj: 1.01, cb: 2.81, intercepto: -60.04 },
            negro: { aj: 1.24, cb: 2.97, intercepto: -82.48 }
        }
    },
    idoso: {
        masculino: {
            branco: { aj: 1.10, cb: 3.07, intercepto: -75.81 },
            negro: { aj: 0.44, cb: 2.86, intercepto: -39.21 }
        },
        feminino: {
            branco: { aj: 1.09, cb: 2.68, intercepto: -65.51 },
            negro: { aj: 1.50, cb: 2.58, intercepto: -84.22 }
        }
    }
};

const ALTURA_CHUMLEA = {
    adulto: {
        masculino: {
            branco: { base: 71.85, aj: 1.88 },
            negro: { base: 73.42, aj: 1.79 }
        },
        feminino: {
            branco: { base: 70.25, aj: 1.87, idade: -0.06 },
            negro: { base: 68.10, aj: 1.87, idade: -0.06 }
        }
    },
    idoso: {
        masculino: {
            default: { base: 64.19, aj: 2.04, idade: -0.04 }
        },
        feminino: {
            default: { base: 84.88, aj: 1.83, idade: -0.24 }
        }
    }
};

const CLASSIFICACAO_GORDURA = {
    masculino: [
        { limite: 5, texto: 'Gordura essencial' },
        { limite: 13, texto: 'Atleta' },
        { limite: 17, texto: 'Fitness' },
        { limite: 24, texto: 'Aceitável' },
        { limite: Infinity, texto: 'Acima do recomendado' }
    ],
    feminino: [
        { limite: 13, texto: 'Gordura essencial' },
        { limite: 20, texto: 'Atleta' },
        { limite: 24, texto: 'Fitness' },
        { limite: 31, texto: 'Aceitável' },
        { limite: Infinity, texto: 'Acima do recomendado' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    configurarEventos();
    atualizarContadorVisitas();
});

function configurarEventos() {
    const mapaEventos = [
        { id: 'btn-calcular-peso', handler: calcularPesoAJCB },
        { id: 'btn-calcular-altura', handler: calcularAlturaEstimada },
        { id: 'btn-calcular-gordura', handler: calcularPercentualGordura }
    ];

    mapaEventos.forEach(({ id, handler }) => {
        const botao = document.getElementById(id);
        if (botao) {
            botao.addEventListener('click', handler);
        }
    });
}

function calcularPesoAJCB() {
    const dados = obterDadosEntrada();
    const mensagemErro = validarCampos(dados, ['idade', 'aj', 'cb']);

    if (mensagemErro) {
        exibirResultado('resultado-peso-ajcb', mensagemErro, true);
        return;
    }

    const peso = estimarPesoChumlea(dados);

    if ('erro' in peso) {
        exibirResultado('resultado-peso-ajcb', peso.erro, true);
        return;
    }

    exibirResultado('resultado-peso-ajcb', `Peso estimado: ${peso.valor.toFixed(2)} kg`);
}

function calcularAlturaEstimada() {
    const dados = obterDadosEntrada();
    const mensagemErro = validarCampos(dados, ['idade', 'aj']);

    if (mensagemErro) {
        exibirResultado('resultado-altura-estimada', mensagemErro, true);
        return;
    }

    const altura = estimarAlturaChumlea(dados);

    if ('erro' in altura) {
        exibirResultado('resultado-altura-estimada', altura.erro, true);
        return;
    }

    exibirResultado('resultado-altura-estimada', `Altura estimada: ${altura.valor.toFixed(2)} cm`);
}

function calcularPercentualGordura() {
    const dados = obterDadosEntrada();
    const mensagemErro = validarCampos(dados, ['idade', 'aj', 'cb']);

    if (mensagemErro) {
        exibirResultado('resultado-percentual-gordura', mensagemErro, true);
        return;
    }

    const peso = estimarPesoChumlea(dados);
    if ('erro' in peso) {
        exibirResultado('resultado-percentual-gordura', peso.erro, true);
        return;
    }

    const altura = estimarAlturaChumlea(dados);
    if ('erro' in altura) {
        exibirResultado('resultado-percentual-gordura', altura.erro, true);
        return;
    }

    const percentual = estimarPercentualGordura({
        idade: dados.idade,
        genero: dados.genero,
        pesoKg: peso.valor,
        alturaCm: altura.valor
    });

    if ('erro' in percentual) {
        exibirResultado('resultado-percentual-gordura', percentual.erro, true);
        return;
    }

    const texto = `Percentual estimado de gordura corporal: ${percentual.valor.toFixed(1)}% (${percentual.classificacao}).`;
    exibirResultado('resultado-percentual-gordura', texto);
}

function obterDadosEntrada() {
    return {
        idade: parseIntSeguro(document.getElementById('idade')?.value),
        genero: normalizarGenero(document.getElementById('genero1')?.value),
        etnia: normalizarEtnia(document.getElementById('etnia')?.value),
        aj: parseFloatSeguro(document.getElementById('aj')?.value),
        cb: parseFloatSeguro(document.getElementById('cb')?.value)
    };
}

function validarCampos(dados, camposObrigatorios) {
    for (const campo of camposObrigatorios) {
        const valor = dados[campo];
        if (!Number.isFinite(valor) || valor <= 0) {
            return `Por favor, insira ${CAMPOS_LABEL[campo] || 'um valor válido'}.`;
        }
    }
    return null;
}

function estimarPesoChumlea({ idade, genero, etnia, aj, cb }) {
    const faixa = obterFaixaEtaria(idade);
    if (!faixa) {
        return { erro: 'Idade fora da faixa de cálculo (apenas adultos).' };
    }

    const coefGenero = PESO_CHUMLEA[faixa][genero];
    if (!coefGenero) {
        return { erro: 'Gênero não suportado para a fórmula selecionada.' };
    }

    const coeficientes = coefGenero[etnia];
    if (!coeficientes) {
        return { erro: 'Não há coeficientes definidos para essa combinação de etnia.' };
    }

    const peso = (aj * coeficientes.aj) + (cb * coeficientes.cb) + coeficientes.intercepto;
    return { valor: peso };
}

function estimarAlturaChumlea({ idade, genero, etnia, aj }) {
    const faixa = obterFaixaEtaria(idade);
    if (!faixa) {
        return { erro: 'Idade fora da faixa de cálculo (apenas adultos).' };
    }

    const coefGenero = ALTURA_CHUMLEA[faixa][genero];
    if (!coefGenero) {
        return { erro: 'Gênero não suportado para a fórmula selecionada.' };
    }

    const coeficientes = coefGenero[etnia] || coefGenero.default;
    if (!coeficientes) {
        return { erro: 'Não há coeficientes definidos para essa combinação de etnia.' };
    }

    let altura = coeficientes.base + (aj * coeficientes.aj);
    if (typeof coeficientes.idade === 'number') {
        altura += coeficientes.idade * idade;
    }

    return { valor: altura };
}

function estimarPercentualGordura({ idade, genero, pesoKg, alturaCm }) {
    const alturaM = alturaCm / 100;
    if (!Number.isFinite(alturaM) || alturaM <= 0) {
        return { erro: 'Altura estimada inválida para calcular o percentual de gordura.' };
    }

    const imc = pesoKg / (alturaM * alturaM);
    if (!Number.isFinite(imc) || imc <= 0) {
        return { erro: 'Não foi possível calcular o IMC com os dados fornecidos.' };
    }

    const sexoCoeficiente = genero === 'masculino' ? 1 : 0;
    const percentual = Math.max(0, (1.2 * imc) + (0.23 * idade) - (10.8 * sexoCoeficiente) - 5.4);
    const classificacao = classificarPercentualGordura(genero, percentual);

    return { valor: percentual, classificacao };
}

function classificarPercentualGordura(genero, percentual) {
    const faixas = CLASSIFICACAO_GORDURA[genero] || CLASSIFICACAO_GORDURA.masculino;
    const faixa = faixas.find((item) => percentual <= item.limite);
    return faixa ? faixa.texto : 'Classificação indisponível';
}

function obterFaixaEtaria(idade) {
    if (!Number.isFinite(idade)) {
        return null;
    }
    if (idade >= 18 && idade <= 60) {
        return 'adulto';
    }
    if (idade > 60) {
        return 'idoso';
    }
    return null;
}

function exibirResultado(elementId, mensagem, isErro = false) {
    const elemento = document.getElementById(elementId);
    if (!elemento) {
        return;
    }
    elemento.textContent = mensagem;
    elemento.classList.toggle('is-error', Boolean(isErro));
}

function parseIntSeguro(valor) {
    const numero = Number.parseInt(valor, 10);
    return Number.isFinite(numero) ? numero : NaN;
}

function parseFloatSeguro(valor) {
    const numero = Number.parseFloat(valor);
    return Number.isFinite(numero) ? numero : NaN;
}

function normalizarGenero(valor) {
    return valor === 'feminino' ? 'feminino' : 'masculino';
}

function normalizarEtnia(valor) {
    return valor === 'negro' ? 'negro' : 'branco';
}

function atualizarContadorVisitas() {
    const contadorElemento = document.getElementById('visit-count');

    if (!contadorElemento) {
        return;
    }

    const namespace = 'nutricalc.moraesarmando';
    const key = 'visits';
    const endpoint = `https://api.countapi.xyz/hit/${namespace}/${key}`;

    fetch(endpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao acessar contador: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const valor = typeof data.value === 'number' ? data.value : null;
            contadorElemento.textContent = valor !== null ? valor.toLocaleString('pt-BR') : 'N/D';
        })
        .catch((error) => {
            console.error('Falha ao atualizar o contador de visitas', error);
            contadorElemento.textContent = 'N/D';
        });
}