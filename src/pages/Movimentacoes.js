import React, {useState} from 'react'
import Rest from '../utils/rest'

const baseURL = 'https://mymoney-giobdev.firebaseio.com/'
const {useGet, usePost, useDelete, usePatch} = Rest(baseURL)

const Movimentacoes = ({match}) => {
  const data = useGet(`movimentacoes/${match.params.data}`)
  const dataMeses = useGet(`meses/${match.params.data}`)
  const [dataPatch, patch] = usePatch()
  const [postData, salvar] = usePost(`movimentacoes/${match.params.data}`)
  const [removeData, remover] = useDelete('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState(0)

  const onChangeDescricao = evt => {
    setDescricao(evt.target.value)
  }

  const onChangeValor = evt => {
    setValor(evt.target.value)
  }

  const salvarMovimentacao = async () => {
    if (!isNaN(valor) && valor.search(/^[-]?\d+(\.)?\d+?$/) >= 0) {
      await salvar({
        descricao,
        valor: parseFloat(valor)
      });
      setDescricao("")
      setValor("")
      data.refetch()
      await sleep(1000)
      dataMeses.refetch()
    }
  };
  const sleep = time => new Promise(resolve => setTimeout(resolve, time))
  const removerMovimentacao = async(id) => {
    await remover(`movimentacoes/${match.params.data}/${id}`)
    data.refetch()
  }

  const alterarPrevisaoEntrada = (evt) => {
    patch(`meses/${match.params.data}`, {
      previsao_entrada: evt.target.value
    })
  }

  const alteraPrevisaoSaida = (evt) => {
    patch(`meses/${match.params.data}`, {
      previsao_saida: evt.target.value
    })
  }

    return(
      <div className='container'>
        <h1>Movimentações</h1>
        { !dataMeses.loading &&
          <div>
            {dataMeses.data &&
            <table className='table table-sm table-dark'>
              <thead>
                <tr>
                  <th>Previsão de Entrada</th>
                  <th>Previsão de Saída</th>
                  <th>Entradas</th>
                  <th>Saídas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{dataMeses.data.previsao_entrada} <input style={{width:50}} onBlur={alterarPrevisaoEntrada} type='text' /></td>
                  <td>{dataMeses.data.previsao_saida} <input style={{width:50}} onBlur={alteraPrevisaoSaida} type='text'/></td>
                  <td>{dataMeses.data.entradas}</td>
                  <td>{dataMeses.data.saidas}</td>
                </tr>
              </tbody>
            </table>
            }
          </div>
        }
        <table className='table table-dark'>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {data.data &&
              Object.keys(data.data)
              .map(movimentacao => {
                return(
                  <tr key={movimentacao}>
                    <td>{data.data[movimentacao].descricao}</td>
                    <td >
                    {data.data[movimentacao].valor}
                    </td>
                    <td className='text-right'>
                    <button className='btn btn-danger' onClick={() => removerMovimentacao(movimentacao)}>Remover</button>
                    </td>
                  </tr>
                )
              })
            }
            <tr>
              <td>
                <input style={{width:50}} type='text' value={descricao} onChange={onChangeDescricao}/>
              </td>
              <td className='input-right'>
                <input style={{width:50}} type='text' value={valor} onChange={onChangeValor}/>
              </td>
              <td className='text-right'>
                <button className='btn btn-success' onClick={salvarMovimentacao}>Adicionar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
}

export default Movimentacoes