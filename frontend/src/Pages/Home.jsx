import React from 'react'
import Style from './Home.module.css';
import { useHistory } from 'react-router-dom';

import Card from '../Components/Card';
import Button from '../Components/Button';

const Home = () => {
    const history = useHistory();
    const startRegister=()=>{
        history.push('/authenticate');
    }

    return (
        <div className={Style.cardWrapper}>
            <Card heading="Welcome to Coder's House" imoji="logo">
                <p className={Style.text}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem accusamus obcaecati quia voluptate porro, necessitatibus et rem ipsam voluptates reiciendis molestias officia fugiat eos similique possimus neque sint, distinctio ut!</p>
                <div>
                    <Button ton text="Let's Go" onClick={startRegister}/>
                </div>
                <div className={Style.smallInfo}>
                    <span style={{color:"#07f"}}>Already have an Invite? </span>
                    {/* <Link style={{color:"#07f",fontWeight:"bold",textDecoration:"none"}} to="/login"> Sign In </Link> */}
                </div>
            </Card>
        </div>
    )
}

export default Home


