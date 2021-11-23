import React from 'react'
import RoomCard from '../Components/RoomCard'
import styles from './Rooms.module.css'

const rooms = [
    {
        id: 1,
        topic: 'Which framework best for frontend ?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 3,
        topic: 'What’s new in machine learning?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 4,
        topic: 'Why people use stack overflow?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 5,
        topic: 'Artificial inteligence is the future?',
        speakers: [
            {
                id: 1,
                name: 'John Doe',
                avatar: '/images/monkey-avatar.png',
            },
            {
                id: 2,
                name: 'Jane Doe',
                avatar: '/images/monkey-avatar.png',
            },
        ],
        totalPeople: 40,
    },
];

const Rooms = () => {
    return (
        <div className="container">
            <div className={styles.head}>
                <div className={styles.leftHead}>
                    <h2>All Voice rooms</h2>
                    <div className={styles.searchBox}>
                        <img alt="searchIcon" src="/images/search-icon.png"/>
                        <input/>
                    </div>
                </div>
                <div className={styles.rightHead}>
                    <button className={styles.startRoomBtn}>
                        <img alt="addRoomIcon" src="/images/add-room-icon.png"/>
                        <span>Start a Room</span>
                    </button>
                </div>
            </div>
            <div className={styles.roomList}>
                {
                    rooms.map((room) => {
                        return <RoomCard key={room.id} room={room} />
                    })
                }
            </div>
        </div>
    )
}

export default Rooms
