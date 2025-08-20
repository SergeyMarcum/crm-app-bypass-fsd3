import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Stack,
  Box,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import DomainIcon from "@mui/icons-material/Domain";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { objectApi } from "@/shared/api/object";
import type { ObjectDetail } from "@/entities/object/types";

type Props = {
  objectId: number;
  objectInfo: ObjectDetail;
  onSave?: () => void;
};

export function ObjectInfoCard({ objectId, objectInfo, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<ObjectDetail | null>(objectInfo);
  const [error, setError] = useState<string | null>(null);

  // Инициализация формы
  const [form, setForm] = useState({
    name: objectInfo.name,
    full_name: objectInfo.full_name ?? "",
    address: objectInfo.address,
    characteristic: objectInfo.characteristic ?? "",
  });

  // Эффект для обновления формы при изменении objectInfo
  useEffect(() => {
    setData(objectInfo);
    setForm({
      name: objectInfo.name,
      full_name: objectInfo.full_name ?? "",
      address: objectInfo.address,
      characteristic: objectInfo.characteristic ?? "",
    });
  }, [objectInfo]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    setError(null);

    try {
      // Отправляем обновленные данные на сервер
      await objectApi.update({
        id: objectId,
        domain: data.domain,
        name: form.name,
        full_name: form.full_name,
        address: form.address,
        characteristic: form.characteristic,
        object_type: data.object_type_id,
        parameters: data.parameters?.map((p) => p.id) || [],
      });

      // Обновляем локальные данные
      setData({
        ...data,
        name: form.name,
        full_name: form.full_name,
        address: form.address,
        characteristic: form.characteristic,
      });

      setEditing(false);

      // Вызываем колбэк для обновления данных на странице
      if (onSave) {
        onSave();
      }
    } catch (err) {
      console.error("Ошибка сохранения объекта:", err);
      setError("Не удалось сохранить изменения. Попробуйте снова.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <DomainIcon />
          </Avatar>
        }
        title="Информация по объекту"
        action={
          <IconButton
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
          >
            {editing ? (
              saving ? (
                <CircularProgress size={24} />
              ) : (
                <SaveIcon />
              )
            ) : (
              <EditIcon />
            )}
          </IconButton>
        }
      />
      <CardContent>
        <Stack spacing={2} divider={<Divider />}>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {data && (
            <>
              <InfoField
                label="Наименование объекта"
                value={form.name}
                editing={editing}
                onChange={(v) => handleChange("name", v)}
              />
              <InfoField
                label="Полное наименование объекта"
                value={form.full_name}
                editing={editing}
                onChange={(v) => handleChange("full_name", v)}
              />
              <InfoField
                label="Тип объекта"
                value={data.object_type_text}
                editing={false}
              />
              <InfoField
                label="Адрес"
                value={form.address}
                editing={editing}
                onChange={(v) => handleChange("address", v)}
              />
              <InfoField
                label="Характеристики"
                value={form.characteristic}
                editing={editing}
                onChange={(v) => handleChange("characteristic", v)}
              />
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function InfoField({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {editing && onChange ? (
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          size="small"
        />
      ) : (
        <Typography variant="subtitle2">{value || "—"}</Typography>
      )}
    </Box>
  );
}
