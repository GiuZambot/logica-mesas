import { useState } from "react";
import { Table, Button, Badge, Modal } from 'react-bootstrap';
import './App.css';

const fakeAPI = {
  unidades: { blumenau: 'Blumenau', saopaulo: 'São Paulo' },
  andares: {
    blumenau: [0, 1, 2, 3],
    saopaulo: [0, 1, 2]
  },
  mesas: [
    {
      id: 1,
      unidade: 'blumenau',
      andar: 1
    },
    {
      id: 2,
      unidade: 'blumenau',
      andar: 1
    },
    {
      id: 3,
      unidade: 'blumenau',
      andar: 2
    },
    {
      id: 4,
      unidade: 'blumenau',
      andar: 2
    },
    {
      id: 5,
      unidade: 'blumenau',
      andar: 3
    },
    {
      id: 6,
      unidade: 'blumenau',
      andar: 3
    },
    {
      id: 7,
      unidade: 'blumenau',
      andar: 3
    },
    {
      id: 8,
      unidade: 'blumenau',
      andar: 3
    },
    {
      id: 9,
      unidade: 'saopaulo',
      andar: 1
    },
  ],
  registros: [
    {
      id: 0,
      mesa: 1,
      dia: 4,
      manha: true,
      tarde: true,
      noite: true
    },
    {
      id: 1,
      mesa: 2,
      dia: 4,
      manha: true,
      tarde: true,
      noite: true
    },
    {
      id: 2,
      mesa: 1,
      dia: 5,
      manha: true,
      tarde: true,
      noite: true
    },
    {
      id: 3,
      mesa: 1,
      dia: 6,
      manha: true,
      tarde: false,
      noite: false
    },
    {
      id: 4,
      mesa: 2,
      dia: 6,
      manha: true,
      tarde: false,
      noite: false
    },
    {
      id: 5,
      mesa: 4,
      dia: 5,
      manha: true,
      tarde: true,
      noite: true
    },
  ]
}

export default function App() {
  const [andares, setAndares] = useState();
  const [unidade, setUnidade] = useState();
  const [disponivel, setDisponivel] = useState();
  const [barraDias, setBarraDias] = useState();
  const [reservando, setReservando] = useState({ turnos: 0 });
  const [show, setShow] = useState(false);
  const [modalMsg, setModalMsg] = useState({ titulo: '', texto: '', botao: '' });
  const handleClose = () => setShow(false);

  function handleUnidades(event) {
    setAndares();
    setDisponivel();
    setReservando({ turnos: 0 });
    if (!event.currentTarget.value) {
      setUnidade();
      return;
    }
    setUnidade(event.currentTarget.value);
    const andares = fakeAPI.andares[event.currentTarget.value].map((entrie, index) =>
      <option key={`${entrie}`} value={entrie}>
        {entrie}º Andar. Mesas: {fakeAPI.mesas.filter((x) => (x.unidade === event.currentTarget.value && x.andar === index)).length}
      </option>);
    setAndares(andares);
  }

  function handleAndares(andarEvent) {
    if (!andarEvent.currentTarget.value) {
      setDisponivel();
      return;
    }
    const andar = +andarEvent.currentTarget.value;
    const mesas = fakeAPI.mesas.filter((mesa) => (mesa.unidade === unidade && mesa.andar === andar));

    let dias = [];
    let temMesaDia = [];
    for (let dia = 1; dia < 7; dia++) {
      const registrosDia = fakeAPI.registros.filter(reg => reg.dia === dia);
      let qtdMesaDisponivel = 0;
      let qtdMesaManha = 0;
      let qtdMesaTarde = 0;
      let qtdMesaNoite = 0;

      for (const mesa of mesas) {
        const mesadispo = registrosDia.some(regdia => regdia.mesa === mesa.id);
        if (!mesadispo) qtdMesaDisponivel++;
        const mesaManha = registrosDia.findIndex(regdia => (regdia.mesa === mesa.id && regdia.manha === true));
        if (mesaManha === -1) qtdMesaManha++;
        const mesaTarde = registrosDia.findIndex(regdia => (regdia.mesa === mesa.id && regdia.tarde === true));
        if (mesaTarde === -1) qtdMesaTarde++;
        const mesaNoite = registrosDia.findIndex(regdia => (regdia.mesa === mesa.id && regdia.noite === true));
        if (mesaNoite === -1) qtdMesaNoite++;
      }

      dias.push(<th key={`dia-${dia}`}>{dia}/11</th>);
      temMesaDia.push({ dia, qtdMesaDisponivel, qtdMesaManha, qtdMesaTarde, qtdMesaNoite });
    }

    setDisponivel(dias);
    setBarraDias(temMesaDia);
  }

  function handleRegistrando() {
    setReservando({ turnos: reservando.turnos + 1 });
  }

  function handleCancelar() {
    setReservando({ turnos: 0 });
  }

  const handleReservar = () => {
    if (reservando.turnos > 10) {
      setModalMsg({
        titulo: 'Atenção!',
        texto: 'Periodo de reserva máxima atingida, o máximo são 10 periodos',
        botao: 'Entendi!',
        callback: handleClose
      })
      setShow(true);
      return;
    }

    setModalMsg({
      titulo: 'Confirmação de Reserva',
      texto: 'Clique em confirmar para reservar os turnos escolhidos.',
      botao: 'Confirmar',
      callback: handleRegistroOk
    })
    setShow(true);
  }
  const handleRegistroOk = () => {
    setModalMsg({
      titulo: 'Reserva Confirmada',
      texto: 'Sua reserva foi confirmada com sucesso',
      botao: 'OK',
      callback: handleClose
    })
  }

  return (
    <div className="App">
      <select onChange={handleUnidades}>
        <option value=''>Selecionar Unidade</option>
        {Object.entries(fakeAPI.unidades).map((entrie) => <option key={entrie[0]} value={entrie[0]}>{entrie[1]}</option>)}
      </select>

      {andares &&
        <select onChange={handleAndares}>
          <option value=''>Selecionar Andar</option>
          {andares}
        </select>
      }

      {disponivel &&
        <Table responsive striped bordered size="sm">
          <thead>
            <tr>
              {disponivel}
            </tr>
          </thead>
          <tbody>
            <tr>
              {barraDias.map((turnos) => <td key={`turno-${turnos.dia}`}>
                <Button
                  className='turnos'
                  onClick={handleRegistrando}
                  variant={turnos.qtdMesaManha ? 'primary' : 'secondary'}>
                  Manhã<Badge bg="secondary">{turnos.qtdMesaManha}</Badge></Button>
                <Button
                  className='turnos'
                  onClick={handleRegistrando}
                  variant={turnos.qtdMesaTarde ? 'primary' : 'secondary'}
                >Tarde<Badge bg="secondary">{turnos.qtdMesaTarde}</Badge></Button>
                <Button
                  className='turnos'
                  onClick={handleRegistrando}
                  variant={turnos.qtdMesaNoite ? 'primary' : 'secondary'}
                >Noite<Badge bg="secondary">{turnos.qtdMesaNoite}</Badge></Button>
              </td>)}
            </tr>
          </tbody>
        </Table>
      }

      {reservando.turnos > 0 &&
        <>
          <Button onClick={handleCancelar} variant='warning'>
            cancelar <Badge bg="secondary"></Badge>
          </Button>
          <Button onClick={handleReservar} variant={reservando.turnos > 10 ? 'danger' : 'primary'}>
            Registrar<Badge bg="secondary">:{reservando.turnos}</Badge>
          </Button>
        </>
      }

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalMsg.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMsg.texto}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button onClick={modalMsg.callback} variant="primary">{modalMsg.botao}</Button>
        </Modal.Footer>
      </Modal>

    </div >
  )
}