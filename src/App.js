import React, { useEffect, useState } from "react"
import "./style.css"
import Die from "./Components/Die"
import Confetti from "./Components/Confetti"
import {nanoid} from "nanoid"

export default function App() {
    const [newDices, setNewDices] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rolls,setRolls] = useState(0)
    const [start, setStart] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [hours, setHours] = useState(0)

    if (seconds > 59) {
        setSeconds(0)
    }
    if (minutes > 59) {
        setMinutes(0)
        setHours(hour => hour + 1)
    }
    if (hours > 23) {
        setHours(0)
    }

    useEffect(() => {
        let timer = setInterval(() => {
            if (!start) {
                return
            }
            if (tenzies) {
                return
            }
            setSeconds(second => second + 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [start, !tenzies])

    useEffect(() => {
        const checkAll = newDices.every(die => die.isHeld)
        const firstValue = newDices[0].value
        const sameNumber = newDices.every(die => firstValue === die.value)
        if (checkAll && sameNumber) {
            setTenzies(true)
        }
    }, [newDices])

    function generateNewDie() {
        return {
            value: Math.floor(Math.random() * 6) + 1,
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        let arrNum = []
        for (let i = 0; i < 10; i++) {
            arrNum.push(generateNewDie())
        }
        return arrNum
    }

    function rollDice() {
        if (tenzies) {
            setHours(0)
            setMinutes(0)
            setSeconds(0)
            setRolls(0)
            setStart(false)
            setTenzies(false)
            setNewDices(allNewDice())
            return
        }
        setNewDices(dice => dice.map(die => {
            return die.isHeld === false ? generateNewDie() : die
        }))
        
        setRolls(prevRolls => prevRolls + 1)

        setStart(true)
        if (tenzies) {
            return
        }
    }

    function holdDice(id) {
        setStart(true)
        if (tenzies) {
            return
        }

        setNewDices(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }


    const diceElements = newDices.map(die => <Die key = {die.id} value = {die.value} isHeld = {die.isHeld} holdDice = {() => holdDice(die.id)} />)

    return (
        <main>
            {tenzies && <Confetti />}
            {!start && <h1 className = "title">Tenzies</h1>}
            {!start && <p className = "instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>}

            <div className = "dice-container">
                {diceElements}
            </div>

            <button className = "roll-dice" onClick = {rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        
            {start && <div className = "time-rolls">
                <h3>Time: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h3>
                <h3>Rolls: {rolls}</h3>
            </div>}
        </main>
    )
}