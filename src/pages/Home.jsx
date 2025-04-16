import { useState, useEffect } from "react"
import { db } from "../firebase/firebase"
import { deleteDoc, doc } from "firebase/firestore";
import { 
  collection,
  addDoc, 
  query, 
  onSnapshot, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore"

const Home = () => {
  const [exercise, setExercise] = useState("")
  const [weight, setWeight] = useState("")
  const [entries, setEntries] = useState([])

  const handleAdd = async () => {
    if (exercise.trim() === "" || weight.trim() === "") return

    try {
      await addDoc(collection(db, "entries"), {
        exercise,
        weight: Number(weight),
        createdAt: serverTimestamp()
      })
      setExercise("")
      setWeight("")
    } catch (err) {
      console.log("Saving error:", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "entries", id))
    } catch (err) {
      console.error("Error in deleting:", err)
    }
  }

  // Real-time data loading
  useEffect(() => {
    const q = query(collection(db, "entries"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs.map((doc) => ({
        id:doc.id,
        ...doc.data(),
      }))
      setEntries(newEntries)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Training records</h1>


      {/* INPUTS */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Exercise"
          className="flex-1 p-2 border rounded"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Weight (kg)"
          className="w-24 border p-2 rounded"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button 
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 rounded hover:bg-green-600 "
        >
          +
        </button>
      </div>

     {/* LIST OF RECORDS */}
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white shadow rounded p-3 border flex justify-between items-center"
          >
            {/* LEFT: EXERCISE NAME & WEIGHT */}
            <div>
              <div className="font-semibold">{entry.exercise}</div>
              <div className="text-gray-600">{entry.weight} kg</div>
            </div>

            {/* RIGHT: DELETE BUTTON */}
            <button
              onClick={() => handleDelete(entry.id)}
              className="text-red-500 hover:text-red-700 text-xl"
              title="Smazat"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home