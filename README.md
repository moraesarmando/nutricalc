# nutricalc

Calculadora nutricional baseada na fórmula de Chumlea hospedada via GitHub Pages.

## Funcionalidades

- Estimativa de peso corporal para adultos (18+) com base nas equações de Chumlea et al. utilizando altura do joelho (AJ) e circunferência do braço (CB).
- Estimativa de estatura pela mesma família de equações, contemplando ajustes por gênero, etnia e idade onde aplicável.
- Estimativa do percentual de gordura corporal empregando a equação de Deurenberg (IMC, idade e sexo), com classificação automática conforme diretrizes gerais da ACE.

Todas as fórmulas foram validadas contra as planilhas/fotos armazenadas em `calc/` e literaturas originais antes da implementação.

## Contador de visitas

- O contador usa a API pública do [countapi.xyz](https://countapi.xyz/).
- O namespace configurado é `nutricalc.moraesarmando` e a chave é `visits`.
- Caso você deseje reiniciar ou usar um caminho diferente, basta alterar esses valores em `scripts.js` na função `atualizarContadorVisitas`.
- Em ambiente local, cada atualização de página também incrementa o contador; para evitar isso durante testes, troque o `hit` por `get` de forma temporária (`https://api.countapi.xyz/get/...`).

## Desenvolvimento

Abra `index.html` diretamente no navegador ou utilize uma extensão de servidor estático para recarregamentos automáticos.

### Testes locais

1. Inicie um servidor simples (ex.: `python -m http.server 8000`).
2. Acesse `http://localhost:8000` e preencha os campos do card **Dados antropométricos**.
3. Utilize os botões do card **Calcular resultados** para gerar peso, altura e percentual de gordura.
4. Caso queira evitar impacto no contador público durante os testes, altere temporariamente a rota `hit` por `get` na função `atualizarContadorVisitas`.
