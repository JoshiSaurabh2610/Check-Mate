import React from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'

const Avatar = ({onClick}) => {
    return (
        <div>
            <Card heading="Avatar Component" imoji="logo">
                Phone Email
                <Button onClick={onClick} text=" Next "/>
            </Card>
        </div>
    )
}

export default Avatar
