import React from 'react';
import { Button, Container } from 'react-bootstrap';
import './style.scss';

const Stepper = ({ steps, currentStep, setCurrentStep, onStepChange, nextButttonTitle, children }) => {
  const handleNext = () => {
    if (currentStep <= steps.length) {
      const nextStep = currentStep + 1;
      if (onStepChange) {
        const canProceed = onStepChange(nextStep); // Validate before moving forward
        if (!canProceed) return; // Stop if validation fails
      }
      setCurrentStep(nextStep);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Container>
      <div className="stepper-container">
        {steps.map((step, index) => (
          <div key={index} className="step-wrapper">
            {index > 0 && <div className={`step-line ${currentStep > index ? 'completed-line' : ''}`}></div>}
            <div
              className={`step ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
              onClick={() => {
                if (index + 1 < currentStep) {
                  setCurrentStep(index + 1); // Allow only moving back
                }
              }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{step}</div>
            </div>
          </div>
        ))}
      </div>
      {children}
      <div className="d-flex justify-content-center mt-4">
        <Button variant="secondary" onClick={handlePrev} disabled={currentStep === 1}>
          Back
        </Button>
        <Button variant="primary" onClick={handleNext}>
          {nextButttonTitle ? nextButttonTitle : 'Next'}
        </Button>
      </div>
    </Container>
  );
};

export default Stepper;
