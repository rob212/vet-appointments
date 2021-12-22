import { BiCalendar } from 'react-icons/bi'
import AddAppointment from './components/AddAppointment'
import AppointmentInfo from './components/AppointmentInfo'
import Search from './components/Search'
import { useState, useEffect, useCallback } from 'react'

function App() {
  let [appointmentList, setAppointmentList] = useState([])
  let [query, setQuery] = useState('')
  let [sortBy, setSortBy] = useState('petName')
  let [orderBy, setOrderBy] = useState('asc')

  const filteredAppointments = appointmentList
    .filter(appointment => {
      return (
        appointment.petName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        appointment.aptNotes.toLowerCase().includes(query.toLowerCase())
      )
    })
    .sort((a, b) => {
      let order = orderBy === 'asc' ? 1 : -1
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase()
        ? -1 * order
        : 1 * order
    })

  const deleteAppointment = id => {
    setAppointmentList(
      appointmentList.filter(appointment => appointment.id !== id)
    )
  }

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      })
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className='App container mx-auto mt-3 font-size-thin'>
      <h1 className='text-5xl mb-3'>
        <BiCalendar className='inline-block text-red-400 align-top' />
        Your Appointments
      </h1>
      <AddAppointment
        lastId={appointmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0
        )}
        onSendAppointmentInfo={myAppointment =>
          setAppointmentList([...appointmentList, myAppointment])
        }
      />
      <Search
        query={query}
        onQueryChange={searchQuery => setQuery(searchQuery)}
        orderBy={orderBy}
        onOrderByChange={mySort => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={mySort => setSortBy(mySort)}
      />

      <ul className='divide-y divide-gray-200'>
        {filteredAppointments.map(appointment => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={deleteAppointment}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
