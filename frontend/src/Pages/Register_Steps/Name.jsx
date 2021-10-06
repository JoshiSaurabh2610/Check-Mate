import React from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'

const Name = ({onClick}) => {
    return (
        <div>
            <Card heading="Name Component" imoji="logo">
                Phone Email
                <Button onClick={onClick} text=" Next "/>
            </Card>
        </div>
    )
}

export default Name
