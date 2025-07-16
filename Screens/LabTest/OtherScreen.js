import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const OtherScreen = ({route}) => {
    const {tests, labId} = route.params;
    console.log('load labs....',labId);
    console.log('load labs....',tests);
    return(
    <>
      
    </>
    );
}
export default OtherScreen;