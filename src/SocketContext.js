import React, { createContext, useState, useRef, useEffect } from 'react'
import {io} from 'socket.io-client'
import Peer from 'simple-peer'

const SocketContext = createContext()

// const socket = io('http://localhost:5000')  // pass in the server url
const socket = io('https://lightning-chat.herokuapp.com/')  // pass in the server url

const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState()
    const [me, setMe] = useState('')
    const [call, setCall] = useState({})
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState('')

    const mVideo = useRef()
    const uVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }) // permissions
            .then((currentStream) => {
                
                setStream(currentStream)

                mVideo.current.srcObject = currentStream    // populate video iframe with stream src
                
            })
        
        socket.on('me', (id) => setMe(id))

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal })
        })
    }, [])

    const answerCall = () => {
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from })
        })

        peer.on('stream', (currentStream) => {  // for other user
            uVideo.current.srcObject = currentStream // populate video iframe with stream src
        })

        peer.signal(call.signal)

        connectionRef.current = peer 
     }
    
    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: me, name })
        })

        peer.on('stream', (currentStream) => {  // for other user
            uVideo.current.srcObject = currentStream // populate video iframe with stream src
        })
     
        socket.on('callAccepted', (signal) => { 
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer

        console.log('callUser with id: ', id)
        // console.log(mVideo.current.srcObject)
        console.log('stream: ', stream)
        console.log('me: ', me)
        console.log('call: ', call)
        console.log('callAccepted: ', callAccepted)
        console.log('name: ', name)
    }
    
    const leaveCall = () => { 
        setCallEnded(true)

        connectionRef.current.destroy()
        
        window.location.reload()    // reload page and create new id
    }

    return (
        <SocketContext.Provider value={{ call, callAccepted, mVideo, uVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }