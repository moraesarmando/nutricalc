# nutricalc

Calculadora nutricional baseada na fórmula de Chumlea hospedada via GitHub Pages.

## Contador de visitas

- O contador usa a API pública do [countapi.xyz](https://countapi.xyz/).
- O namespace configurado é `nutricalc.moraesarmando` e a chave é `visits`.
- Caso você deseje reiniciar ou usar um caminho diferente, basta alterar esses valores em `scripts.js` na função `atualizarContadorVisitas`.
- Em ambiente local, cada atualização de página também incrementa o contador; para evitar isso durante testes, troque o `hit` por `get` de forma temporária (`https://api.countapi.xyz/get/...`).

## Desenvolvimento

Abra `index.html` diretamente no navegador ou utilize uma extensão de servidor estático para recarregamentos automáticos.
