import React, { Component } from 'react';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { data } from 'autoprefixer';



function hexToDec(s) {
    s= s.replace('0x', '');
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}
export default function AuctionTimer(props) {
    const [h, setH] = useState(0);
    const [d, setD] = useState(0);
    const [m, setM] = useState(0);
    const [s, setS] = useState(0);
    const [isAuction, setIsAuction] = useState(true);


    useEffect(async () => {
        // console.log(hexToDec(props.deadline))
        // console.log(Date.now()/1000);
        // console.log('-----')
        let deadline = hexToDec(props.deadline)
        let now = Math.floor(Date.now()/1000);
        if(deadline == 0){
            setIsAuction(false);
            return;
        } 
        if(deadline < now){
            // props.setAuctioEnd(true);
            return;
        } 
        let id = setInterval(function(){
            // console.log(deadline - now);
            now = Math.floor(Date.now()/1000);
            if(deadline < now){
                clearInterval(id);
            }

            let _seconds = deadline - now;
            // console.log(deadline, now)
            setD(Math.floor(_seconds / 3600 / 24));
            _seconds = _seconds % (3600*24);
            setH(Math.floor(_seconds / 3600));
            _seconds = _seconds % (3600);
            setM(Math.floor(_seconds / 60));
            _seconds = _seconds % (60);
            setS(_seconds)
            // console.log(_seconds)
        }, 1000)
    }, [])
    if(!isAuction){
        return(
            <></>
        )
    }
    const mystyle = {
        position: "absolute",
        // top:"100%",
        bottom: 0,
        width: "100%",
        fontSize: "3rem",
        // transform: "translateY(-50%)",
        backgroundColor: "rgba(1,1,1,0.5)",

    }
    const mystyle2 = {
        marginTop: "50px"
    }
    return (
        <div className="countdown-times" style={(props._type ==2)? mystyle2:mystyle}>
            <div className="countdown d-flex justify-content-center" data-date="2022-01-24">
                <div className="countdown-container days"><span className="countdown-heading days-top">Days</span><span className="countdown-value days-bottom">{d}</span></div>
                <div className="countdown-container hours"><span className="countdown-heading hours-top">Hours</span><span className="countdown-value hours-bottom">{h}</span></div>
                <div className="countdown-container minutes"><span className="countdown-heading minutes-top">Minutes</span><span className="countdown-value minutes-bottom">{m}</span></div>
                <div className="countdown-container seconds"><span className="countdown-heading seconds-top">Seconds</span><span className="countdown-value seconds-bottom">{s}</span></div>
            </div>
        </div>
    );
}