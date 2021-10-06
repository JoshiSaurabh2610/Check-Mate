import React from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'

const Otp = ({onClick}) => {
    return (
        <div>
            <Card heading="OTP component" imoji="logo">
                Phone Email
                <Button onClick={onClick} text=" Next "/>
            </Card>
        </div>
    )
}

export default Otp
