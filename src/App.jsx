import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const storedIds = JSON.parse(localStorage.getItem("pickedPlaces")) || [];
const storedPlace = storedIds.map(id => AVAILABLE_PLACES.find(place => place.id === id));

function App() {
  const selectedPlace = useRef();
  const [isopen, setIsopen] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlace);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const placeSorted = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude);
      setAvailablePlaces(placeSorted);
    })
  
  }, [])

  function handleStartRemovePlace(id) {
    setIsopen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsopen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("pickedPlaces")) || [];
    if (storedIds.indexOf(id) < 0) {
      localStorage.setItem("pickedPlaces", JSON.stringify([id, ...storedIds]))
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    
    const storedIds = JSON.parse(localStorage.getItem("pickedPlaces")) || [];
    const updatedIds = storedIds.filter(id => id !== selectedPlace.current);
    localStorage.setItem("pickedPlaces", JSON.stringify(updatedIds));
    
    setIsopen(false);
  },[])

  return (
    <>
      {isopen && <Modal isopen={isopen} onClick={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>}

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={"sorting available places please wait ..."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
