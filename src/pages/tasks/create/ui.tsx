// src/pages/tasks/create/ui.tsx
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Step1GeneralInfo } from "@/widgets/task-create-step1";
import { Step2Parameters } from "@/widgets/task-create-step2";
import { Step3Summary } from "@/widgets/task-create-step3";

export function TaskCreatePage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: "Основная информация",
      content: <Step1GeneralInfo onNext={() => setActiveStep(1)} />,
    },
    {
      label: "Параметры проверки",
      content: (
        <Step2Parameters
          onNext={() => setActiveStep(2)}
          onBack={() => setActiveStep(0)}
        />
      ),
    },
    {
      label: "Краткий отчет",
      content: (
        <Step3Summary
          onBack={() => setActiveStep(1)}
          onSubmit={() => {
            /* TODO: submit and redirect to /tasks/view */
          }}
        />
      ),
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Создание задания
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Добавление нового задания по проверке объекта филиала
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Box mt={2}>{step.content}</Box>
              {index === steps.length - 1 && (
                <Box mt={2}>
                  <Button onClick={() => setActiveStep(0)}>Сбросить</Button>
                </Box>
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Задание успешно создано.</Typography>
          <Button onClick={() => setActiveStep(0)} sx={{ mt: 1 }}>
            Создать новое
          </Button>
        </Paper>
      )}
    </Box>
  );
}
