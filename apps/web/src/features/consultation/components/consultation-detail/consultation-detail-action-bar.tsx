import { Badge, Button, Card } from "@/components/ui";

interface ConsultationDetailActionBarProps {
  readOnly: boolean;
  showComplete?: boolean;
  actionBusy: boolean;
  onCancel: () => void;
  onSaveVisit: () => void;
  onComplete: () => void;
}

export function ConsultationDetailActionBar({
  readOnly,
  showComplete = true,
  actionBusy,
  onCancel,
  onSaveVisit,
  onComplete
}: ConsultationDetailActionBarProps) {
  return (
    <Card className="sticky -bottom-8 border-subtle bg-neutral-30 backdrop-blur">
      <Card.Body className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="text-sm text-neutral-70">
          {readOnly ? (
            <Badge tone="neutral">Read-only mode</Badge>
          ) : (
            "Save draft anytime, then complete consultation when ready."
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outlined" intent="neutral" onClick={onCancel}>
            Cancel
          </Button>

          {!readOnly ? (
            <Button
              variant="tonal"
              intent="primary"
              startIconName="clipboardList"
              onClick={onSaveVisit}
              disabled={actionBusy}
            >
              Save Visit
            </Button>
          ) : null}

          {!readOnly && showComplete ? (
            <Button
              intent="primary"
              startIconName="check"
              onClick={onComplete}
              disabled={actionBusy}
            >
              Complete Consultation
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
}
