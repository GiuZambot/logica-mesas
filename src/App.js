import { useState } from "react";
import { Table } from 'react-bootstrap';
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
      dia: 4
    },
    {
      id: 1,
      mesa: 2,
      dia: 4
    },
    {
      id: 2,
      mesa: 1,
      dia: 5
    },
    {
      id: 3,
      mesa: 4,
      dia: 5
    },
  ]
}

export default function App() {
  const [andares, setAndares] = useState();
  const [unidade, setUnidade] = useState();
  const [disponivel, setDisponivel] = useState();
  const [barraDias, setBarraDias] = useState();

  const handleAndares = (andarEvent) => {
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

      for (const mesa of mesas) {
        const mesadispo = registrosDia.some(regdia => regdia.mesa === mesa.id);
        if (!mesadispo) qtdMesaDisponivel++;
      }

      dias.push(<th>{dia}/11</th>);
      temMesaDia.push(<td key={`${dia}`}>{qtdMesaDisponivel > 0 ? `${qtdMesaDisponivel} mesas` : 'Não tem Mesas'}</td>);
    }

    setDisponivel(dias);
    setBarraDias(temMesaDia);
  }

  const handleUnidades = (event) => {
    setAndares();
    setDisponivel();
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
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              {disponivel}
            </tr>
          </thead>
          <tbody>
            <tr>
              {barraDias}
            </tr>
          </tbody>
        </Table>
      }
    </div>
  )
}