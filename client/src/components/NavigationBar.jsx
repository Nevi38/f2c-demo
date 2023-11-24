import mainlogo from '../logo.png'
import { Link } from 'react-router-dom';

export default function NavigationBar() {

    return (
        <div id="vertical-navigation-bar" className="bg-white">
            <div className='flex-1'>
                <img className="logo-big" src={mainlogo} />
                {/* GROUP ITEM */}
                <div className="mt-25">
                    <b className="heading ml-13">Menu</b>
                    <ul className="list-item">
                        <li>
                            <Link to="/" className="row">
                                <img
                                    className="icon-heading"
                                    src="https://img.icons8.com/doodle/48/home--v1.png"
                                    alt="home--v1"
                                />
                                <p className="ml-10">Homepage</p>
                            </Link>
                        </li>

                        <li>
                            <Link to="/profile" className="row">
                                <img className="icon-heading" src="https://img.icons8.com/windows/32/gender-neutral-user.png" alt="gender-neutral-user"/>
                                <p className="ml-10">Profile</p>
                            </Link>
                        </li>

                        <li>
                            <Link to="/chat" className="row">
                                <img
                                    className="icon-heading"
                                    src="https://img.icons8.com/pulsar-color/48/chat-message.png"
                                    alt="chat-message"
                                />
                                <p className="ml-10">Chat</p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <button className='btn btn-blue'>Đăng xuất</button>
        </div>
    )
}