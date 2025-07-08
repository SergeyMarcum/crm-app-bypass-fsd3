// src/widgets/object-info-card/ui.tsx
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
} from "@mui/material";
import DomainIcon from "@mui/icons-material/Domain";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { objectApi } from "@/shared/api/object";
import type { ObjectDetail } from "@/entities/object/types";

export function ObjectInfoCard({ objectId }: { objectId: number }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState<ObjectDetail | null>(null);
  const [form, setForm] = useState({
    name: "",
    full_name: "",
    address: "",
    characteristic: "",
    object_type: "",
  });

  useEffect(() => {
    objectApi.getById(objectId).then((res) => {
      setData(res);
      setForm({
        name: res.name,
        full_name: res.full_name ?? "",
        address: res.address,
        characteristic: res.characteristic ?? "",
        object_type: res.object_type,
      });
    });
  }, [objectId]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!data) return;

    await objectApi.update({
      id: objectId,
      domain: data.domain,
      name: form.name,
      address: form.address,
      characteristic: form.characteristic,
      object_type: data.object_type_id,
      parameters: data.parameters.map((p) => p.id),
    });

    setEditing(false);
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
          >
            {editing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        }
      />
      <CardContent>
        <Stack spacing={2} divider={<Divider />}>
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
                value={form.object_type}
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
