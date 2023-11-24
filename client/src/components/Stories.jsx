import { useRef } from 'react'
import storiesStyle from '../styles/stories.css'

export default function Stories()
{
    const serverRef = useRef(`${process.env.REACT_APP_SEVER_IP}:${process.env.REACT_APP_SERVER_PORT}`)

    return (
        <div className='stories'>
            <ul className='list'>
                <li className='card' style={
                    {
                        backgroundImage: `url(${serverRef.current}/stories/hero.jpg)`
                    }
                }>
                    <div className='info'>
                        <img className='avatar' src={`${serverRef.current}/stories/hero.jpg`}></img>
                        <p>Ngọc Ngân</p>
                    </div>
                </li>
                <li className='card' style={
                    {
                        backgroundImage: `url(${serverRef.current}/stories/girl01.jpg)`
                    }
                }>
                    <div className='info'>
                        <img className='avatar' src={`${serverRef.current}/stories/girl01.jpg`}></img>
                        <p>Bùi Tín</p>
                    </div>
                </li>
                <li className='card' style={
                    {
                        backgroundImage: `url(${serverRef.current}/stories/gym-girl.jpg)`
                    }
                }>
                    <div className='info'>
                        <img className='avatar' src={`${serverRef.current}/stories/gym-girl.jpg`}></img>
                        <p>Thanh Ngân</p>
                    </div>
                </li>
                <li className='card' style={
                    {
                        backgroundImage: `url(${serverRef.current}/stories/andrea.jpg)`
                    }
                }>
                    <div className='info'>
                        <img className='avatar' src={`${serverRef.current}/stories/andrea.jpg`}></img>
                        <p>Ngọc Vy</p>
                    </div>
                </li>
                <li className='card' style={
                    {
                        backgroundImage: `url(${serverRef.current}/stories/tower.jpg)`
                    }
                }>
                    <div className='info'>
                        <img className='avatar' src={`${serverRef.current}/stories/tower.jpg`}></img>
                        <p>Hary</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}