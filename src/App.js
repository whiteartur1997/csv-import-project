import { useRef, useState } from 'react'
import './App.css'
import {
  checkFileCorrectness,
  getExtension,
  wholeTableValidation,
} from './utils/utilsFunctions'

function App() {
  const [content, setContent] = useState(null)
  const [error, setError] = useState(null)
  const inputEl = useRef(null)
  const importFile = () => {
    if (content) {
      setContent(null)
    }
    if (error) {
      setError(null)
    }
    const file = inputEl.current.files[0]
    if (!file) {
      setError('Please, choose csv file!')
      return
    }
    const fileFormat = getExtension(file.name)
    if (fileFormat !== 'csv') {
      setError('Wrong file format. Please put csv file.')
      return
    }

    const fileReader = new FileReader()
    fileReader.readAsText(file)
    fileReader.onload = function () {
      // get rows by splitting by the tab
      const rows = fileReader.result.split(/\r?\n|\r/)
      // get rows with cells by splitting by the comma
      let rowsWithCells = rows.map((row) => row.split(','))
      // add duplicate data to all row
      // get rid from commas in yearly income, as well as joining income numbers
      // go through all rows
      rowsWithCells.forEach((r, index) => {
        if (index === 0) {
          r.push('Duplicate')
        } else {
          r.push('')
        }
        let i = 0 // index
        const newArr = [] // new array that will replace existing row with "wrong" income
        while (r.length > i) {
          // if cell doesn't start with ", just push it
          if (r[i][0] !== '"') {
            // if income just a 3 digit value eg 500, we just give it proper format with 2 decimals
            if (i === 5 && r[i] !== 'Yearly Income') {
              r[i] = Number.parseFloat(r[i]).toFixed(2)
            }
            // 1st validation completed
            newArr.push(r[i].trim())
          } else {
            // 1st validation completed
            let value = r[i].trim() // current cell
            let y = 0 // shift, that will be loocking for the end of yearly income (end must contain " as the last charachter)
            while (r[i + y][r[i + y].length - 1] !== '"' && r.length >= i + y) {
              y++ // move shift to next cell
              // accumulate values (milions + thousands + dozens and so on)
              value += r[i + y]
            }
            // move cell to the index right after yearly income
            i = i + y
            // get rid of braces in the start and the end of income
            value = value.substring(1, value.length - 1)
            // check for ".xx"
            value = Number.parseFloat(value).toFixed(2)
            newArr.push(value)
          }
          i++
        }
        // replace old array with "wrong" yearly income to new one with "right"
        rowsWithCells[index] = newArr
      })

      const tableHead = rowsWithCells[0]
      let tableBody = rowsWithCells.splice(1)
      for (let i = 0; i < tableBody.length; i++) {
        tableBody[i] = tableBody[i].map((cell, index) => {
          // format phones
          if (index === 1) {
            if (cell.length === 10 && cell.slice(0, 2) !== '+1') {
              cell = '+1' + cell
            }
            if (cell.length === 11 && cell.slice(0, 1) !== '+') {
              cell = '+' + cell
            }
          }
          return {
            value: cell,
            hasError: false,
            rowWithDuplicate: null,
          }
        })
      }
      // 12th validation completed
      if (!checkFileCorrectness(tableBody)) {
        setError('Uncorrect file format. Fullname, phone or email is missing')
        return
      }
      tableBody = wholeTableValidation(tableBody)
      setContent([tableHead, tableBody])
    }
    fileReader.onerror = function () {
      setError(fileReader.error)
    }
  }

  return (
    <div className="App">
      <div className="fileUploadWrapper">
        <input ref={inputEl} type="file" />
        <button className="import" onClick={importFile}>
          Import users
        </button>
      </div>
      <div className="mainContent">
        {error && <div className="errorDiv">{error}</div>}
        {content && (
          <table cellSpacing={0} className="table">
            <thead>
              <tr>
                <th>ID</th>
                {content[0].map((cell, index) => (
                  <th key={cell + index}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content[1].map((row, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    {row.map((cell, index, row) => {
                      if (index === row.length - 1) {
                        return <td>{cell.rowWithDuplicate}</td>
                      }
                      return (
                        <td
                          className={`${cell.hasError && 'error'}`}
                          key={cell.value + index.toString()}
                        >
                          {cell.value}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
