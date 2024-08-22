const listaDeTarefas = new LinkedList();

function adicionarTarefa() {
  const descricao = document.getElementById("txtnovaTarefa").value.trim();
  const prioridade = document.getElementById("txtnovaPrioridade").value.trim();
  const novaTarefa = new Tarefa(
    descricao,
    prioridade,
    obterDataAtual(),
    obterHoraAtual()
  );
  
  listaDeTarefas.addElemento(novaTarefa);
  console.log(listaDeTarefas.toString());
  document.getElementById("txtnovaTarefa").value = "";
  document.getElementById("txtnovaPrioridade").value = "";
  document.getElementById("txtnovaTarefa").focus();
  atualizarListaTarefas();
}

function removerTarefa() {
  const tarefaRemovida = listaDeTarefas.removeElemento();
  if (tarefaRemovida != null) {
    exibirMensagemRemocao(tarefaRemovida);
    atualizarListaTarefas();
  } else {
    const mensagemRemocao = document.getElementById("mensagem-remocao");
    mensagemRemocao.innerHTML = "Você não possui nenhuma tarefa para remover.";
  }
}

function exibirTarefaMaisAntiga() {
  const mensagemRemocao = document.getElementById("mensagem-remocao");
  if (!listaDeTarefas.isEmpty()) {
    let tarefaMaisAntiga = listaDeTarefas.head.dado;
    for (const tarefa of listaDeTarefas) {
      tarefaMaisAntiga = compararTarefasDataHora(tarefaMaisAntiga, tarefa);
    }
    mensagemRemocao.innerHTML = `A tarefa mais antiga é: ${tarefaMaisAntiga._descricao}, ${tarefaMaisAntiga._data}, ${tarefaMaisAntiga._hora}`;
  } else {
    mensagemRemocao.innerHTML = "A Lista está Vazia.";
  }
  mensagemRemocao.style.display = "block";
}

function exibirPrimeiraTarefa() {
  const mensagemRemocao = document.getElementById("mensagem-remocao");
  if (!listaDeTarefas.isEmpty()) {
    let primeiraTarefa = listaDeTarefas.head.dado;
    mensagemRemocao.innerHTML = `A primeira tarefa é: ${primeiraTarefa._descricao}, ${primeiraTarefa._prioridade}, ${primeiraTarefa._data}, ${primeiraTarefa._hora}`;
  } else {
    mensagemRemocao.innerHTML = "A Lista está Vazia.";
  }
  mensagemRemocao.style.display = "block";
}

function exibirMensagemRemocao(tarefa) {
  const mensagem = document.getElementById("mensagem-remocao");
  const dataAtual = new Date();
  const dataFormatada = `${String(dataAtual.getDate()).padStart(
    2,
    "0"
  )}/${String(dataAtual.getMonth() + 1).padStart(
    2,
    "0"
  )}/${dataAtual.getFullYear()}`;
  const horaAtual = `${dataAtual
    .getHours()
    .toString()
    .padStart(2, "0")}:${dataAtual
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dataAtual.getSeconds().toString().padStart(2, "0")}`;
  mensagem.innerHTML = `Tarefa: ${
    tarefa.descricao
  } realizada em ${calcularDifDias(
    tarefa._data,
    dataFormatada
  )} e ${calcularDifHoras(tarefa._hora, horaAtual)}.`;
  mensagem.style.display = "block";
}

function atualizarListaTarefas() {
  const listaHtml = document.getElementById("list_listadeTarefas");
  listaHtml.innerHTML = "";
  console.log(listaDeTarefas);
  if (!listaDeTarefas.isEmpty()) {
    for (const tarefa of listaDeTarefas) {
      const novaLinha = document.createElement("li");
      novaLinha.innerHTML = tarefa.toString();
      listaHtml.appendChild(novaLinha);
    }
  } else {
    listaHtml.innerHTML = "<li>Lista de Tarefas Vazia</li>";
  }
}

function obterDataAtual() {
  let dataAtual = new Date();
  let dia = dataAtual.getDate();
  let mes = dataAtual.getMonth() + 1;
  let ano = dataAtual.getFullYear();
  let dataFormatada = `${dia.toString().padStart(2, "0")}/${mes
    .toString()
    .padStart(2, "0")}/${ano}`;
  return dataFormatada;
}

function obterHoraAtual() {
  const data = new Date();
  const hora = data.getHours().toString().padStart(2, "0");
  const minuto = data.getMinutes().toString().padStart(2, "0");
  const segundo = data.getSeconds().toString().padStart(2, "0");
  return `${hora}:${minuto}:${segundo}`;
}

function calcularDifHoras(hora1, hora2) {
  const [h1, m1, s1] = hora1.split(":").map(Number);
  const [h2, m2, s2] = hora2.split(":").map(Number);
  const diferencaSegundos =
    h2 * 3600 + m2 * 60 + s2 - (h1 * 3600 + m1 * 60 + s1);
  const horas = Math.floor(diferencaSegundos / 3600);
  const minutos = Math.floor((diferencaSegundos % 3600) / 60);
  const segundos = diferencaSegundos % 60;
  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")} [horas:minutos:segundos]`;
}

function calcularDifDias(dataInicial, dataFinal) {
  const msPorDia = 24 * 60 * 60 * 1000;
  const [diaIni, mesIni, anoIni] = dataInicial.split("/").map(Number);
  const [diaFim, mesFim, anoFim] = dataFinal.split("/").map(Number);
  const dataIni = new Date(anoIni, mesIni - 1, diaIni); 
  const dataFim = new Date(anoFim, mesFim - 1, diaFim);
  const diferencaMs = dataFim - dataIni;
  const diferencaDias = Math.floor(diferencaMs / msPorDia);
  return diferencaDias + " dias";
}

function formatarDataISO(data) {
  const partes = data.split("/");
  const dia = partes[0].padStart(2, "0");
  const mes = partes[1].padStart(2, "0");
  const ano = partes[2];
  return `${ano}-${mes}-${dia}`;
}

function compararTarefasDataHora(tarefa1, tarefa2) {
  const dataHora1 = new Date(
    `${formatarDataISO(tarefa1._data)}T${tarefa1._hora}`
  );
  const dataHora2 = new Date(
    `${formatarDataISO(tarefa2._data)}T${tarefa2._hora}`
  );
  if (dataHora1.getTime() < dataHora2.getTime()) {
    return tarefa1;
  } else {
    return tarefa2;
  }
}

function salvarListaLocalStorage() {
  console.log("salvarListaLocalStorage");
  let listaParaSalvar = [];
  for (const item of listaDeTarefas) {
    listaParaSalvar.push({
      _descricao: item.descricao,
      _prioridade: item.prioridade,
      _data: item.data,
      _hora: item.hora,
    });
    console.log(item.toString());
  }
  let jsonStr = JSON.stringify(listaParaSalvar);
  console.log(jsonStr);
  localStorage.setItem("listaTarefas", jsonStr);
  alert("Lista salva com sucesso!");
}

function carregarListaLocalStorage() {
  console.log("carregarListaLocalStorage");
  let jsonStr = localStorage.getItem("listaTarefas");
  if (jsonStr) {
    let listaCarregada = JSON.parse(jsonStr);
    for (let i = 0; i < listaCarregada.length; i++) {
      let obj = listaCarregada[i];
      let tarefaCarregada = new Tarefa(
        obj._descricao,
        obj._prioridade,
        obj._data,
        obj._hora
      );
      console.log(tarefaCarregada.toString());
      listaDeTarefas.addLast(tarefaCarregada);
    }
    atualizarListaTarefas();
    alert("Lista carregada com sucesso!");
  }
}
