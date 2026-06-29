"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Lock, CheckCheck, Check, Reply, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import { useDemo } from "@/lib/demo/use-demo";
import { selectDmThread, dayDiff, type DmMessageView } from "@/lib/demo/state";
import { useGuard } from "@/lib/demo/hooks";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

function dayLabel(iso: string): string {
  const d = dayDiff(new Date(), new Date(iso));
  if (d === 0) return "Bugun";
  if (d === 1) return "Kecha";
  const dt = new Date(iso);
  return `${String(dt.getDate()).padStart(2, "0")}.${String(dt.getMonth() + 1).padStart(2, "0")}.${dt.getFullYear()}`;
}
function hhmm(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const { user } = useGuard();
  const st = useDemo();
  const sendDm = useDemo((s) => s.sendDm);
  const editDm = useDemo((s) => s.editDm);
  const deleteDm = useDemo((s) => s.deleteDm);
  const markThreadRead = useDemo((s) => s.markThreadRead);

  const [text, setText] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [replyTo, setReplyTo] = useState<DmMessageView | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<DmMessageView | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [attaching, setAttaching] = useState(false);

  const partnerId = params.id;

  const uid = user?.id;
  useEffect(() => {
    if (uid) markThreadRead(partnerId);
  }, [uid, partnerId, markThreadRead, st.dmMessages.length]);

  if (!user) return null;
  const thread = selectDmThread(st, user.id, partnerId);
  const partner = thread.partner;
  if (!partner) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[var(--width-shell)] flex-col items-center justify-center gap-3 bg-background px-5 text-center">
        <p className="text-muted">Foydalanuvchi topilmadi.</p>
        <Link href="/inbox" className={cn(buttonVariants({ size: "md" }))}>Xabarlarga qaytish</Link>
      </div>
    );
  }

  const buyerPays = !thread.meIsSeller && thread.messagePrice > 0 && !editingId;

  function reset() {
    setText(""); setConfirm(false); setReplyTo(null); setEditingId(null); setImageUrl(""); setAttaching(false);
  }
  function doSend() {
    if (editingId) {
      if (text.trim()) editDm(editingId, text.trim());
      reset();
      return;
    }
    if (!text.trim() && !imageUrl.trim()) return;
    const res = sendDm(partnerId, text.trim(), { replyToId: replyTo?.id, imageUrl: imageUrl.trim() || undefined });
    if (res.ok) reset();
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !imageUrl.trim()) return;
    if (buyerPays) setConfirm(true);
    else doSend();
  }

  const rows = thread.messages.map((m, i) => ({
    m,
    day: dayLabel(m.createdAt),
    showDay: i === 0 || dayLabel(m.createdAt) !== dayLabel(thread.messages[i - 1].createdAt),
  }));

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[var(--width-shell)] flex-col bg-background sm:border-x sm:border-border">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <Link href="/inbox" className="text-muted"><ArrowLeft size={22} /></Link>
        {partner.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.avatar} alt={partner.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">{partner.name.charAt(0)}</span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{partner.name}</p>
          <p className="truncate text-xs text-subtle">@{partner.username}</p>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4">
        {thread.messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-subtle">
            Suhbat boshlanmagan. {buyerPays && `Birinchi xabar — ${formatPrice(thread.messagePrice)}.`}
          </p>
        )}
        {rows.map(({ m, day, showDay }) => {
          return (
            <div key={m.id}>
              {showDay && (
                <div className="my-2 flex justify-center">
                  <span className="rounded-full bg-surface-2 px-3 py-0.5 text-[11px] text-muted">{day}</span>
                </div>
              )}
              <div className={cn("flex", m.mine ? "justify-end" : "justify-start")}>
                <button
                  type="button"
                  onClick={() => !m.deleted && setActionMsg(m)}
                  className={cn(
                    "max-w-[82%] rounded-2xl px-3.5 py-2 text-left text-sm",
                    m.deleted ? "bg-surface-2 italic text-subtle" : m.mine ? "rounded-br-sm bg-accent text-white" : "rounded-bl-sm bg-surface-2 text-foreground"
                  )}
                >
                  {m.replyTo && !m.deleted && (
                    <div className={cn("mb-1 rounded-md border-l-2 px-2 py-1 text-xs", m.mine ? "border-white/60 bg-white/15" : "border-accent bg-background")}>
                      <span className="font-semibold">{m.replyTo.senderName}</span>
                      <p className="truncate opacity-80">{m.replyTo.text}</p>
                    </div>
                  )}
                  {m.deleted ? (
                    <p>🗑 Bu xabar o&apos;chirildi</p>
                  ) : (
                    <>
                      {m.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.imageUrl} alt="" className="mb-1 max-h-60 rounded-lg object-cover" />
                      )}
                      {m.text && <p className="whitespace-pre-wrap">{m.text}</p>}
                    </>
                  )}
                  <div className={cn("mt-1 flex items-center gap-1 text-[10px]", m.mine ? "text-white/70" : "text-subtle")}>
                    {m.isPaid && <span>💳 {formatPrice(m.paidAmount)}</span>}
                    {m.edited && <span>tahrirlangan</span>}
                    <span className="ml-auto">{hhmm(m.createdAt)}</span>
                    {m.mine && !m.deleted && (m.read ? <CheckCheck size={13} className="text-white" /> : <Check size={13} />)}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply / edit preview */}
      {(replyTo || editingId) && (
        <div className="flex items-center gap-2 border-t border-border bg-surface px-4 py-2 text-xs">
          {editingId ? <Pencil size={14} className="text-accent" /> : <Reply size={14} className="text-accent" />}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-accent">{editingId ? "Tahrirlash" : `Javob: ${replyTo?.mine ? "Siz" : partner.name}`}</p>
            <p className="truncate text-muted">{editingId ? text : replyTo?.text}</p>
          </div>
          <button type="button" onClick={() => { setReplyTo(null); setEditingId(null); if (editingId) setText(""); }} className="text-muted"><X size={16} /></button>
        </div>
      )}

      {!thread.messagingEnabled ? (
        <div className="flex shrink-0 items-center gap-2 border-t border-border bg-surface px-4 py-4 text-sm text-subtle">
          <Lock size={16} /> Bu sotuvchi shaxsiy xabarni o&apos;chirgan.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="shrink-0 border-t border-border bg-surface p-3">
          {buyerPays && (
            <p className="mb-2 text-center text-xs text-subtle">
              Har bir xabar — <span className="font-semibold text-accent">{formatPrice(thread.messagePrice)}</span>. Sotuvchining javobi bepul.
            </p>
          )}
          {attaching && (
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Rasm havolasi (https://...)"
              className="mb-2 h-10 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
            />
          )}
          <div className="flex items-center gap-2">
            {!editingId && (
              <button type="button" onClick={() => setAttaching((v) => !v)} className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", attaching ? "bg-accent-soft text-accent" : "text-muted")}>
                <ImagePlus size={20} />
              </button>
            )}
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={editingId ? "Tahrirlash..." : "Xabar yozing..."}
              className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground placeholder:text-subtle focus:border-accent focus:outline-none"
            />
            <button type="submit" disabled={!text.trim() && !imageUrl.trim()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40">
              <Send size={18} />
            </button>
          </div>
        </form>
      )}

      {/* Xabar amallari */}
      {actionMsg && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setActionMsg(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[var(--width-shell)] rounded-t-[var(--radius-xl)] border-t border-border bg-surface p-2">
            <button type="button" onClick={() => { setReplyTo(actionMsg); setEditingId(null); setActionMsg(null); }} className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm text-foreground hover:bg-surface-2">
              <Reply size={18} /> Javob berish
            </button>
            {actionMsg.mine && (
              <button type="button" onClick={() => { setEditingId(actionMsg.id); setText(actionMsg.text); setReplyTo(null); setActionMsg(null); }} className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm text-foreground hover:bg-surface-2">
                <Pencil size={18} /> Tahrirlash
              </button>
            )}
            {actionMsg.mine && (
              <button type="button" onClick={() => { setConfirmDel(actionMsg.id); setActionMsg(null); }} className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 text-sm text-danger hover:bg-surface-2">
                <Trash2 size={18} /> O&apos;chirish
              </button>
            )}
          </div>
        </>
      )}

      {/* To'lov tasdig'i */}
      {confirm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setConfirm(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[var(--width-shell)] rounded-t-[var(--radius-xl)] border-t border-border bg-surface p-5">
            <h3 className="text-base font-bold text-foreground">Xabarni yuborish</h3>
            <p className="mt-2 text-sm text-muted">
              {partner.name}ga shaxsiy xabar — <span className="font-semibold text-accent">{formatPrice(thread.messagePrice)}</span> (demo).
            </p>
            <div className="mt-4 flex gap-2">
              <Button block onClick={doSend}>To&apos;lash va yuborish</Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>Bekor</Button>
            </div>
          </div>
        </>
      )}

      {/* Xabarni o'chirish tasdig'i */}
      {confirmDel && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setConfirmDel(null)} />
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[var(--width-shell)] rounded-t-[var(--radius-xl)] border-t border-border bg-surface p-5">
            <h3 className="text-base font-bold text-foreground">Xabarni o&apos;chirish</h3>
            <p className="mt-2 text-sm text-muted">Bu xabarni o&apos;chirmoqchimisiz?</p>
            <div className="mt-4 flex gap-2">
              <Button variant="danger" block onClick={() => { deleteDm(confirmDel); setConfirmDel(null); }}>
                <Trash2 size={16} /> O&apos;chirish
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDel(null)}>Bekor</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
