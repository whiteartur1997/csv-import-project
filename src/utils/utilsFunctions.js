import moment from 'moment'
import { usStates } from './USStates'

// store emails and phones to check for duplicates
export let arrOfEmails = []
export let arrOfPhones = []

// check file extension
export function getExtension(filename) {
  var parts = filename.split('.')
  return parts[parts.length - 1]
}

// for 3th validation task
function checkAge(age) {
  if (!Number.isInteger(+age.value) || age.value < 21 || +age.value === 0) {
    age.hasError = true
  }

  return age
}

// for 4th validation task
function checkExperience(experience, age) {
  if (experience.value < 0 || experience.value > age.value - 21) {
    experience.hasError = true
  }

  return experience
}

// for 5th validation task
function checkIncome(income) {
  if (income.value > 1000000 || income.value < 0) {
    income.hasError = true
  }

  return income
}

// for 7th validation task
function checkStates(licenseStates) {
  // split states to separete elements
  const statesArr = licenseStates.value.split('|')
  // here we will store right value to display on UI
  let valueToDisplay = ''
  // flag that will signal, that we identified wrongly typed state
  let errorOccured = false
  for (let state of statesArr) {
    state = state.toLowerCase()
    // if we have full name of state
    if (state.length > 2) {
      // check for abbreviation by full name
      const indexOfRightAbbreviation = usStates.findIndex((usState) => {
        return usState.name.toLowerCase() === state
      })
      // if full name is ok, store abbreviation for fisplay
      if (indexOfRightAbbreviation !== -1) {
        valueToDisplay += usStates[indexOfRightAbbreviation].abbreviation + '|'
      } else {
        // if full name is wrong
        // short full name to first 2 letters
        valueToDisplay += state.slice(0, 2).toUpperCase() + '|'
        // // the cell will be red
        // licenseStates.hasError = true
        // error identified
        errorOccured = true
      }
      // if we have abbreviation
    } else {
      const indexOfAbbreviation = usStates.findIndex(
        (usState) => usState.abbreviation === state.toUpperCase()
      )

      // check that this abbreviation is right
      if (indexOfAbbreviation !== -1) {
        // put right abbrevation to the value to display on UI
        valueToDisplay += usStates[indexOfAbbreviation].abbreviation + '|'
      } else {
        valueToDisplay += state.toUpperCase() + '|'
        // the cell will be red
        licenseStates.hasError = true
        // error identified
        errorOccured = true
      }
    }
  }

  licenseStates.value = valueToDisplay.slice(0, valueToDisplay.length - 1)
  errorOccured && (licenseStates.hasError = true)

  return licenseStates
}

// for 8th validation task
function checkDate(dateObj) {
  const actualDate = moment(dateObj.value)
  if (
    moment(actualDate._i, ['MM/DD/YYYY', 'YYYY-MM-DD'], true).format() ===
      'Invalid date' ||
    moment().diff(actualDate, 'days') > 0
  ) {
    dateObj.hasError = true
  }

  return dateObj
}

// for 9th validation task
function checkPhoneFormat(phone) {
  const regex = /^[0-9]+$/
  if (
    phone.value.length !== 12 ||
    phone.value.slice(0, 2) !== '+1' ||
    !phone.value.slice(1).match(regex)
  ) {
    phone.hasError = true
  }

  return phone
}

// for 10th validation task
function checkChildren(children) {
  if (
    children.value.toLowerCase() !== 'true' &&
    children.value.toLowerCase() !== 'false' &&
    children.value.toLowerCase() !== ''
  ) {
    children.hasError = true
  }

  return children
}

// for 11th validation task
function checkLicenseNumber(license) {
  const regex = /[^A-Za-z0-9]+/
  if (license.value.match(regex) || license.value.length !== 6) {
    license.hasError = true
  }

  return license
}

// for 12th validation task
export function checkFileCorrectness(table) {
  let correct = true
  for (let row of table) {
    if (row[0].value === '' || row[1].value === '' || row[2].value === '') {
      correct = false
      break
    }
  }
  return correct
}

export function wholeTableValidation(table) {
  for (let i = 0; i < table.length; i++) {
    table[i] = table[i].map((cell, index, row) => {
      switch (index) {
        case 1:
          // 9th validation task
          cell = checkPhoneFormat(cell)

          // 2nd validation task
          const indexOfDuplicateValue = arrOfPhones.findIndex(
            (phone) => phone === cell.value.toLowerCase()
          )

          if (indexOfDuplicateValue !== -1) {
            cell.hasError = true
            table[indexOfDuplicateValue][1].hasError = true
            table[indexOfDuplicateValue][10].rowWithDuplicate
              ? (table[indexOfDuplicateValue][10].rowWithDuplicate =
                  table[indexOfDuplicateValue][10].rowWithDuplicate)
              : (table[indexOfDuplicateValue][10].rowWithDuplicate = i + 1)
            row[row.length - 1].rowWithDuplicate = indexOfDuplicateValue + 1
          }

          arrOfPhones.push(cell.value.toLowerCase())

          return cell
        // 2nd validation task
        case 2: {
          // code was duplicated with the phone, I know
          // coudln't come up with the idea how to assign proper values to the table
          // from the external util function for duplicates check
          const indexOfDuplicateValue = arrOfEmails.findIndex(
            (email) => email === cell.value.toLowerCase()
          )
          if (indexOfDuplicateValue !== -1) {
            cell.hasError = true
            table[indexOfDuplicateValue][2].hasError = true
            table[indexOfDuplicateValue][10].rowWithDuplicate
              ? (table[indexOfDuplicateValue][10].rowWithDuplicate =
                  table[indexOfDuplicateValue][10].rowWithDuplicate)
              : (table[indexOfDuplicateValue][10].rowWithDuplicate = i + 1)
            row[row.length - 1].rowWithDuplicate = indexOfDuplicateValue + 1
          }

          arrOfEmails.push(cell.value.toLowerCase())

          return cell
        }
        case 3:
          // 3rd validation task
          cell = checkAge(cell)
          return cell
        case 4:
          // 4th validation task
          cell = checkExperience(cell, row[index - 1])
          return cell
        case 5:
          // 5th validation task
          cell = checkIncome(cell)
          return cell
        case 6:
          // 10th validation task
          cell = checkChildren(cell)
          return cell
        case 7:
          // for 7th validation task
          cell = checkStates(cell)
          return cell
        case 8:
          // 8th davlidation task
          cell = checkDate(cell)
          return cell
        case 9:
          // 11th validation task
          cell = checkLicenseNumber(cell)
          return cell
        default:
          return cell
      }
    })
  }

  // clean array for the next tables, to avoid wrong duplicates
  arrOfEmails = []
  arrOfPhones = []

  return table
}
