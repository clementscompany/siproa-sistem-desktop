export function numeroPorExtenso(valor) {
  if (!valor) return "Zero kwanzas";

  const unidades = [
    "",
    "um",
    "dois",
    "três",
    "quatro",
    "cinco",
    "seis",
    "sete",
    "oito",
    "nove",
  ];
  const dez_a_dezenove = [
    "dez",
    "onze",
    "doze",
    "treze",
    "quatorze",
    "quinze",
    "dezesseis",
    "dezessete",
    "dezoito",
    "dezenove",
  ];
  const dezenas = [
    "",
    "",
    "vinte",
    "trinta",
    "quarenta",
    "cinquenta",
    "sessenta",
    "setenta",
    "oitenta",
    "noventa",
  ];
  const centenas = [
    "",
    "cento",
    "duzentos",
    "trezentos",
    "quatrocentos",
    "quinhentos",
    "seiscentos",
    "setecentos",
    "oitocentos",
    "novecentos",
  ];
  const milhares = ["", "mil", "milhões", "bilhões", "trilhões"];

  let n = parseFloat(valor).toFixed(2);
  let partes = n.split(".");
  let inteiro = parseInt(partes[0]);
  let decimal = parseInt(partes[1]);

  if (inteiro === 0 && decimal === 0) return "Zero kwanzas";

  let extenso = "";

  // Parte Inteira
  if (inteiro > 0) {
    let grupos = [];
    let temp = inteiro;
    while (temp > 0) {
      grupos.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    }

    for (let i = grupos.length - 1; i >= 0; i--) {
      let grupo = grupos[i];
      if (grupo === 0) continue;

      let grupoExtenso = "";
      let c = Math.floor(grupo / 100);
      let d = Math.floor((grupo % 100) / 10);
      let u = grupo % 10;

      if (c > 0) {
        if (grupo === 100) grupoExtenso += "cem";
        else grupoExtenso += centenas[c];
      }

      if (d > 0 || u > 0) {
        if (c > 0) grupoExtenso += " e ";

        if (d === 1) {
          grupoExtenso += dez_a_dezenove[u];
        } else {
          if (d > 0) grupoExtenso += dezenas[d];
          if (d > 0 && u > 0) grupoExtenso += " e ";
          if (u > 0) grupoExtenso += unidades[u];
        }
      }

      extenso += grupoExtenso;

      if (i === 1) {
        // Milhar
        if (grupo === 1 && grupos.length === 2 && grupos[0] === 1) {
          // Ajuste para "mil" em vez de "um mil" se for o único grupo de milhar e valor < 2000? Não, "um mil" é aceitável, mas "mil" é mais comum.
          // Simplificação: manter "um mil" ou tratar exceção.
          // Para "1000", grupos=[1, 0]. i=1 (mil). grupo=1. extenso="um". -> "um mil".
        }
        extenso += " mil";
      } else if (i === 2) {
        // Milhões
        extenso += grupo === 1 ? " milhão" : " milhões";
      } else if (i === 3) {
        // Bilhões
        extenso += grupo === 1 ? " bilhão" : " bilhões";
      }

      if (i > 0 && grupos[i - 1] > 0) {
        // Lógica complexa de "e" ou vírgula. Simplificando com " e " se não tiver centenas redondas no próximo.
        if (grupos[i - 1] < 100 || grupos[i - 1] % 100 === 0) {
          extenso += " e ";
        } else {
          extenso += ", ";
        }
      }
    }
    extenso += inteiro === 1 ? " kwanza" : " kwanzas";
  }

  // Parte Decimal (Centavos)
  if (decimal > 0) {
    if (inteiro > 0) extenso += " e ";
    let d = Math.floor(decimal / 10);
    let u = decimal % 10;
    let decimalExtenso = "";

    if (d === 1) {
      decimalExtenso += dez_a_dezenove[u];
    } else {
      if (d > 0) decimalExtenso += dezenas[d];
      if (d > 0 && u > 0) decimalExtenso += " e ";
      if (u > 0) decimalExtenso += unidades[u];
    }
    extenso += decimalExtenso + (decimal === 1 ? " cêntimo" : " cêntimos");
  }

  // Capitalize first letter
  return extenso.charAt(0).toUpperCase() + extenso.slice(1);
}
