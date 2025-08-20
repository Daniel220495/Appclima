import { useEffect, useState } from 'react'
import axios from 'axios'
import { getIcon } from './lib/utils'
import { BrushCleaning, MapPin, MapPinHouse, Search, Waves, Wind } from 'lucide-react'
function App() {
  const [coords, setCoords] = useState(null)
  const [cityName, setCityName] = useState('Peru')
  const [weather, setWeather] = useState(null)
  const [search, setSearch] = useState('')
  // único useEffect para coords o ciudad
  useEffect(() => {
    if (!coords && !cityName) return
    const params = coords
      ? { lat: coords.lat, lon: coords.lon }
      : { q: cityName }
    axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          ...params,
          units: "metric",
          lang: "es",
          appid: "282c96edfacdb6966e23e4b1c4dc5efd",
        },
      })
      .then((res) =>
        setWeather({
          name: res.data.name || res.data.sys.country,
          description: res.data.weather[0].description,
          temp: res.data.main.temp.toFixed(0),
          icon: res.data.weather[0] && getIcon(res.data.weather[0].icon),
          wind: res.data.wind.speed.toFixed(0),
          humidity: res.data.main.humidity,
        })
      )
      .catch((err) => console.error("Error al obtener clima:", err))
  }, [coords, cityName])
  // geolocalización
  const setLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          })
        },
        (err) => {
          console.error("Error obteniendo ubicación:", err)
        }
      )
    } else {
      alert("La geolocalización no es soportada en este navegador")
    }
  }
  // limpiar todo
  const clearAll = () => {
    setSearch("")
    setCityName("")
    setCoords(null)
    setWeather(null)
  }
  // buscar por ciudad
  const handleSubmit = (e) => {
    e.preventDefault()
    if (search.trim() === "") return
    setCityName(search.trim())
    setSearch("")
  }
  return (
    <div className='container'>
      <div className='card'>
        <div className='card__head'>
          <form onSubmit={handleSubmit} className='search'>
            <Search className='search__icon' />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='search__input'
              placeholder="Buscar ciudad..."
            />
          </form>
          <div className='buttons'>
            <button onClick={setLocation} className='buttons__btn'>
              <MapPinHouse className='buttons__icon' />
            </button>
            <button onClick={clearAll} className='buttons__btn'>
              <BrushCleaning className='buttons__icon' />
            </button>
          </div>
        </div>
        <div className='card__body'>
          {weather && (
            <div className='weather'>
              <h2 className='weather__name'>
                <MapPin className='weather__name-icon' />
                {weather.name}
              </h2>
              <div className='weather__icon'>
                <svg
                  fill='#000'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  width={200}
                  height={200}
                  viewBox='0 -5 35 42'
                >
                  <title>{weather.description}</title>
                  <path d={weather.icon} />
                </svg>
              </div>
              <h2 className='weather__temp'>
                {weather.temp}
                <span className='weather__temp-span'>°C</span>
              </h2>
              <p className='weather__description'>{weather.description}</p>
              <ul className='weather__list'>
                <li className="weather__item">
                  <Wind className='weather__item-icon' />
                  <span className="weather__span">
                    <span className='weather__span-value'>
                      <b>{weather.wind}</b> km/h
                    </span>
                    <span className='weather__span-label'>
                      Viento
                    </span>
                  </span>
                </li>
                <li className='weather__item'>
                  <Waves className='weather__item-icon' />
                  <span className="weather__span">
                    <span className='weather__span-value'>
                      <b>{weather.humidity}</b> %
                    </span>
                    <span className='weather__span-label'>
                      Humedad
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default App