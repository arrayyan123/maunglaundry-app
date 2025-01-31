import React, { useState, useEffect } from "react";
import { Stepper, Step } from "@material-tailwind/react";

const TransactionStepper = ({ activeStep, steps }) => {
    return (
        <Stepper activeStep={activeStep} className="lg:my-0 lg:top-20 top-0 my-6 px-1 xl:w-[80%] lg:w-[120%] lg:rotate-90 rotate-0">
            {steps.map((step, index) => (
                <Step key={index} className="cursor-default lg:-rotate-90 rotate-0">
                    <div className="absolute lg:right-[4.5rem] right-0 lg:-bottom-1 -bottom-[4.5rem]">
                        <p className="text-black">{step}</p>
                    </div>
                </Step>
            ))}
        </Stepper>
    );
};

export default TransactionStepper;