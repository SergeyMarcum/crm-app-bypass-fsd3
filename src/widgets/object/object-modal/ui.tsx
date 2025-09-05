// src/widgets/object-modal/ui.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Button,
  Stack,
  Typography,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";
import { objectApi } from "@/shared/api/object";
import { objectTypeApi } from "@/shared/api/object-type";
import type { ObjectModalProps, ObjectType, Parameter } from "./types";
import { storage } from "@/shared/lib/storage"; // Импорт storage

export const ObjectModal = ({ open, onClose }: ObjectModalProps) => {
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [characteristic, setCharacteristic] = useState("");

  const [types, setTypes] = useState<ObjectType[]>([]);
  const [selectedType, setSelectedType] = useState<ObjectType | null>(null);

  const [typeParams, setTypeParams] = useState<Parameter[]>([]);
  const [customParams, setCustomParams] = useState<Parameter[]>([]);
  const [newParam, setNewParam] = useState<Parameter | null>(null);

  // Добавьте новое состояние для всех доступных параметров
  const [allAvailableParams, setAllAvailableParams] = useState<Parameter[]>([]);

  useEffect(() => {
    if (!open) return;
    // Сброс состояний при открытии модального окна
    setName("");
    setFullName("");
    setAddress("");
    setCharacteristic("");
    setSelectedType(null);
    setTypeParams([]);
    setCustomParams([]);
    setNewParam(null);

    // Загрузка типов объектов
    objectTypeApi.getAllObjectTypes().then(setTypes);
    // Загрузка всех параметров для выпадающего списка "Добавить параметр"
    objectTypeApi
      .getAllParameters()
      .then((res: Array<{ id: number; name?: string; number?: string }>) => {
        const transformedParams: Parameter[] = res.map((p) => ({
          id: p.id,
          name: p.name || p.number || "",
        }));
        setAllAvailableParams(transformedParams);
      });
  }, [open]);

  useEffect(() => {
    if (!selectedType) {
      setTypeParams([]); // Очистить, если тип не выбран
      return;
    }
    objectTypeApi
      .getObjectTypeParameters(selectedType.id)
      .then((res: Array<{ id: number; parameter?: string; name?: string }>) => {
        const transformed: Parameter[] = res.map((r) => ({
          id: r.id,
          name: r.parameter || r.name || "",
        }));
        setTypeParams(transformed);
        setCustomParams([]); // очистить при выборе типа
      });
  }, [selectedType]);

  const handleSave = async () => {
    const params = [...typeParams, ...customParams].map((p) => p.id);
    const domain = storage.get("auth_domain") || ""; // Используем storage.get

    await objectApi
      .create({
        name,
        full_name: fullName,
        address,
        characteristic,
        object_type: selectedType?.id ?? 0,
        parameters: params,
        domain,
      })
      .then(() => onClose())
      .catch((err) => {
        console.error("Ошибка при сохранении объекта:", err);
        // Добавьте здесь обработку ошибок, например, отображение уведомления пользователю
      });
  };

  // Параметры, которые уже выбраны (тип объекта + пользовательские)
  const currentSelectedParamIds = new Set(
    [...typeParams, ...customParams].map((p) => p.id)
  );

  // Доступные параметры для добавления (все параметры минус уже выбранные)
  const filteredAvailableParams = allAvailableParams.filter(
    (p) => !currentSelectedParamIds.has(p.id)
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Новый объект
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Название объекта"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Полное наименование объекта"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            label="Адрес"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Характеристики"
            fullWidth
            value={characteristic}
            onChange={(e) => setCharacteristic(e.target.value)}
          />

          <Autocomplete
            options={types}
            getOptionLabel={(t) => t.name}
            value={selectedType}
            onChange={(_, v) => setSelectedType(v)}
            renderInput={(params) => (
              <TextField {...params} label="Тип объекта" />
            )}
          />

          <Typography variant="subtitle1">Параметры проверки</Typography>
          {[...typeParams, ...customParams].map((p, idx) => (
            <Stack key={p.id} direction="row" spacing={1} alignItems="center">
              <Typography>{idx + 1}.</Typography>
              <Typography sx={{ flex: 1 }}>{p.name}</Typography>
              {!typeParams.find((tp) => tp.id === p.id) && (
                <IconButton
                  onClick={() =>
                    setCustomParams((prev) => prev.filter((x) => x.id !== p.id))
                  }
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          ))}

          <Stack direction="row" spacing={1} alignItems="center">
            <Autocomplete
              // Используйте отфильтрованный список параметров здесь
              options={filteredAvailableParams}
              getOptionLabel={(o) => o.name}
              value={newParam}
              onChange={(_, val) => setNewParam(val)}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField {...params} label="Добавить параметр" />
              )}
            />
            <IconButton
              onClick={() => {
                if (newParam && !currentSelectedParamIds.has(newParam.id)) {
                  setCustomParams((prev) => [...prev, newParam]);
                  setNewParam(null);
                }
              }}
              color="primary"
            >
              <AddIcon />
            </IconButton>
          </Stack>

          <Button variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
