import React from 'react';
import style from './RoomCard.module.css';

const RoomCard = ({ room }) => {
    return (
        <div className={style.Card}>
            <h2>{room.topic}</h2>
            <div className={style.Speakers}>
                <div className={style.speakerAvatars}>
                    {room.speakers.map((speaker) => {
                        return <img alt={speaker.name} key={speaker.id} src={speaker.avatar} />
                    })}
                </div>
                <div>
                    {room.speakers.map((speaker) => {
                        return <div key={speaker.id} className={style.nameWrapper}>
                            <span>{speaker.name}</span>
                            <img alt={speaker.name} src="/images/chat-bubble.png" />
                        </div>
                    })}
                </div>
            </div>
            <div className={style.totalPeople}>
                {room.totalPeople}
                <img alt="userIcon" src="/images/user-icon.png" />
            </div>
        </div>
    )
}

export default RoomCard
