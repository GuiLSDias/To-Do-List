const listaTarefas = new LinkedList();

function adicionarItem() {
  const descricaoTarefa = document.getElementById("txtnovaTarefa").value.trim();
  const prioridadeTarefa = document.getElementById("txtnovaPrioridade").value.trim();
  const itemTarefa = new Tarefa(
    descricaoTarefa,
    prioridadeTarefa,
    obterDataAtual(),
    obterHoraAtual()
  );
  
  listaTarefas.addElemento(itemTarefa);
  console.log(listaTarefas.toString());
  document.getElementById("txtnovaTarefa").value = "";
  document.getElementById("txtnovaPrioridade").value = "";
  document.getElementById("txtnovaTarefa").focus();
  atualizarLista();
}

function concluirItem() {
  const itemRemovido = listaTarefas.removeElemento();
  if (itemRemovido != null) {
    mostrarMensagemRemocao(itemRemovido);
    atualizarLista();
  } else {
    const mensagemRemocao = document.getElementById("mensagem-remocao");
    mensagemRemocao.innerHTML = "Você não possui nenhuma tarefa para remover.";
  }
}

function exibirItemMaisAntigo() {
  const mensagemRemocao = document.getElementById("mensagem-remocao");
  if (!listaTarefas.isEmpty()) {
    let itemMaisAntigo = listaTarefas.head.dado;
    for (const item of listaTarefas) {
      itemMaisAntigo = comparaTarefasDataHora(itemMaisAntigo, item);
    }
    mensagemRemocao.innerHTML = `A tarefa mais antiga é: ${itemMaisAntigo._descricao}, ${itemMaisAntigo._data}, ${itemMaisAntigo._hora}`;
  } else {
    mensagemRemocao.innerHTML = "A Lista está Vazia.";
  }
  mensagemRemocao.style.display = "block";
}

function exibirItemInicio() {
  const mensagemRemocao = document.getElementById("mensagem-remocao");
  if (!listaTarefas.isEmpty()) {
    let itemInicio = listaTarefas.head.dado;
    mensagemRemocao.innerHTML = `A tarefa do início é: ${itemInicio._descricao}, ${itemInicio._prioridade}, ${itemInicio._data}, ${itemInicio._hora}`;
  } else {
    mensagemRemocao.innerHTML = "A Lista está Vazia.";
  }
  mensagemRemocao.style.display = "block";
}

function mostrarMensagemRemocao(tarefaRealizada) {
  const mensagem = document.getElementById("mensagem-remocao");
  const dataAtual = new Date();
  const dataAtualFormatada = `${String(dataAtual.getDate()).padStart(
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
    tarefaRealizada.descricao
  } realizada em ${calcularDiferencaDias(
    tarefaRealizada._data,
    dataAtualFormatada
  )} e ${calcularDiferencaHoras(tarefaRealizada._hora, horaAtual)}.`;
  mensagem.style.display = "block";
}

function atualizarLista() {
  const listaHtml = document.getElementById("list_listadeTarefas");
  listaHtml.innerHTML = "";
  console.log(listaTarefas)
  if (!listaTarefas.isEmpty()) {
    for (const tarefa of listaTarefas) {
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

function calcularDiferencaHoras(hora1, hora2) {
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

function calcularDiferencaDias(dataInicial, dataFinal) {
  const msPorDia = 24 * 60 * 60 * 1000;
  const [diaIni, mesIni, anoIni] = dataInicial.split("/").map(Number);
  const [diaFim, mesFim, anoFim] = dataFinal.split("/").map(Number);
  const dataIni = new Date(anoIni, mesIni - 1, diaIni); 
  const dataFim = new Date(anoFim, mesFim - 1, diaFim);
  const diferencaMs = dataFim - dataIni;
  const diferencaDias = Math.floor(diferencaMs / msPorDia);
  return diferencaDias + " dias";
}

function converterDataFormatoISO8601(data) {
  const partes = data.split("/");
  const dia = partes[0].padStart(2, "0");
  const mes = partes[1].padStart(2, "0");
  const ano = partes[2];
  return `${ano}-${mes}-${dia}`;
}

function comparaTarefasDataHora(tarefa1, tarefa2) {
  const dataHoraTarefa1 = new Date(
    `${converterDataFormatoISO8601(tarefa1._data)}T${tarefa1._hora}`
  );
  const dataHoraTarefa2 = new Date(
    `${converterDataFormatoISO8601(tarefa2._data)}T${tarefa2._hora}`
  );
  if (dataHoraTarefa1.getTime() < dataHoraTarefa2.getTime()) {
    return tarefa1;
  } else {
    return tarefa2;
  }
}

function saveLinkedListToLocalStorage() {
  console.log("saveLinkedListToLocalStorage");
  let listaParaSalvar = [];
  for (const item of minhaLista) {
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
  localStorage.setItem("myLinkedList", jsonStr);
  alert("Lista salva com sucesso!");
}

function loadLinkedListFromLocalStorage() {
  console.log("loadLinkedListFromLocalStorage");
  let jsonStr = localStorage.getItem("myLinkedList");
  if (jsonStr) {
    let listaCarregada = JSON.parse(jsonStr);
    for (let i = 0; i < listaCarregada.length; i++) {
      let obj = listaCarregada[i];
      let novaTarefa = new Tarefa(
        obj._descricao,
        obj._prioridade,
        obj._data,
        obj._hora
      );
      console.log(novaTarefa.toString());
      minhaLista.addLast(novaTarefa);
    }
    atualizarLista();
    alert("Lista carregada com sucesso!");
  }
}
