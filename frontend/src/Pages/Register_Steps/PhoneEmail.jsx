import React from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'

const PhoneEmail = ({onClick}) => {
    return (
        <div>
            <Card heading="Enter Phone or Email" imoji="logo">
                Phone Email
                <Button onClick={onClick} text=" Next "/>
            </Card>
        </div>
    )
}

export default PhoneEmail
