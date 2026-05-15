​​​​​import { useState, useEffect } from “react”;

const DAYS = [“Montag”, “Dienstag”, “Mittwoch”, “Donnerstag”, “Freitag”, “Samstag”, “Sonntag”];
const DAY_SHORT = [“Mo”, “Di”, “Mi”, “Do”, “Fr”, “Sa”, “So”];

const SAMPLE_DISHES = [
{ id: 1, name: “Spaghetti Bolognese”, emoji: “🍝”, ingredients: [{ name: “Spaghetti”, amount: “400”, unit: “g” }, { name: “Rinderhackfleisch”, amount: “500”, unit: “g” }, { name: “Tomaten (Dose)”, amount: “400”, unit: “g” }, { name: “Zwiebel”, amount: “1”, unit: “Stk” }, { name: “Knoblauch”, amount: “2”, unit: “Zehen” }] },
{ id: 2, name: “Hähnchen Curry”, emoji: “🍛”, ingredients: [{ name: “Hähnchenbrustfilet”, amount: “600”, unit: “g” }, { name: “Kokosmilch”, amount: “400”, unit: “ml” }, { name: “Currypaste”, amount: “2”, unit: “EL” }, { name: “Basmatireis”, amount: “300”, unit: “g” }, { name: “Paprika”, amount: “2”, unit: “Stk” }] },
{ id: 3, name: “Gemüsesuppe”, emoji: “🥣”, ingredients: [{ name: “Karotten”, amount: “3”, unit: “Stk” }, { name: “Sellerie”, amount: “2”, unit: “Stk” }, { name: “Kartoffeln”, amount: “4”, unit: “Stk” }, { name: “Gemüsebrühe”, amount: “1.5”, unit: “L” }, { name: “Lauch”, amount: “1”, unit: “Stk” }] },
];

const generateId = () => Math.random().toString(36).slice(2);

export default function App() {
const [tab, setTab] = useState(“plan”);
const [dishes, setDishes] = useState(SAMPLE_DISHES);
const [weekPlan, setWeekPlan] = useState({});
const [showAddDish, setShowAddDish] = useState(false);
const [showDishPicker, setShowDishPicker] = useState(null); // day index
const [showDishDetail, setShowDishDetail] = useState(null);
const [newDish, setNewDish] = useState({ name: “”, emoji: “🍽️”, ingredients: [{ id: generateId(), name: “”, amount: “”, unit: “g” }] });
const [toast, setToast] = useState(null);

const showToast = (msg) => {
setToast(msg);
setTimeout(() => setToast(null), 2200);
};

const randomPlan = () => {
if (dishes.length === 0) return showToast(“Keine Gerichte vorhanden!”);
const plan = {};
DAYS.forEach((_, i) => {
plan[i] = dishes[Math.floor(Math.random() * dishes.length)].id;
});
setWeekPlan(plan);
showToast(“Zufälliger Wochenplan erstellt! 🎲”);
};

const removeDishFromPlan = (day) => {
const p = { …weekPlan };
delete p[day];
setWeekPlan(p);
};

const selectDishForDay = (dayIdx, dishId) => {
setWeekPlan(p => ({ …p, [dayIdx]: dishId }));
setShowDishPicker(null);
showToast(“Gericht zugewiesen ✓”);
};

const getShoppingList = () => {
const totals = {};
Object.values(weekPlan).forEach(dishId => {
const dish = dishes.find(d => d.id === dishId);
if (!dish) return;
dish.ingredients.forEach(ing => {
const key = `${ing.name}__${ing.unit}`;
if (!totals[key]) totals[key] = { name: ing.name, unit: ing.unit, amount: 0, dishes: [] };
totals[key].amount += parseFloat(ing.amount) || 0;
if (!totals[key].dishes.includes(dish.name)) totals[key].dishes.push(dish.name);
});
});
return Object.values(totals).sort((a, b) => a.name.localeCompare(b.name));
};

const saveDish = () => {
if (!newDish.name.trim()) return showToast(“Bitte Name eingeben”);
const validIngs = newDish.ingredients.filter(i => i.name.trim());
if (validIngs.length === 0) return showToast(“Mindestens 1 Zutat”);
const dish = { …newDish, id: generateId(), ingredients: validIngs };
setDishes(d => […d, dish]);
setShowAddDish(false);
setNewDish({ name: “”, emoji: “🍽️”, ingredients: [{ id: generateId(), name: “”, amount: “”, unit: “g” }] });
showToast(“Gericht gespeichert ✓”);
};

const deleteDish = (id) => {
setDishes(d => d.filter(x => x.id !== id));
const p = { …weekPlan };
Object.keys(p).forEach(k => { if (p[k] === id) delete p[k]; });
setWeekPlan(p);
setShowDishDetail(null);
showToast(“Gericht gelöscht”);
};

const addIngredientRow = () => setNewDish(d => ({ …d, ingredients: […d.ingredients, { id: generateId(), name: “”, amount: “”, unit: “g” }] }));
const removeIngredientRow = (rid) => setNewDish(d => ({ …d, ingredients: d.ingredients.filter(i => i.id !== rid) }));
const updateIngredient = (rid, field, val) => setNewDish(d => ({ …d, ingredients: d.ingredients.map(i => i.id === rid ? { …i, [field]: val } : i) }));

const shoppingList = getShoppingList();
const plannedDishIds = new Set(Object.values(weekPlan));

const EMOJIS = [“🍝”,“🍛”,“🥣”,“🍲”,“🥗”,“🍕”,“🌮”,“🍣”,“🥘”,“🍜”,“🥩”,“🐟”,“🫕”,“🥞”,“🍳”];

return (
<div style={{ fontFamily: “‘SF Pro Display’, -apple-system, BlinkMacSystemFont, sans-serif”, background: “#F2F2F7”, minHeight: “100vh”, maxWidth: 430, margin: “0 auto”, position: “relative”, paddingBottom: 90 }}>

```
  {/* Header */}
  <div style={{ background: "linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)", padding: "52px 20px 24px", color: "#fff" }}>
    <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, opacity: 0.85, textTransform: "uppercase", marginBottom: 4 }}>
      {tab === "plan" ? "Wochenplan" : tab === "dishes" ? "Meine Gerichte" : "Einkaufsliste"}
    </div>
    <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
      {tab === "plan" ? "Diese Woche" : tab === "dishes" ? `${dishes.length} Gerichte` : `${shoppingList.length} Artikel`}
    </div>
    {tab === "plan" && (
      <button onClick={randomPlan} style={{ marginTop: 14, background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 20, color: "#fff", padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
        🎲 Zufälligen Plan erstellen
      </button>
    )}
    {tab === "dishes" && (
      <button onClick={() => setShowAddDish(true)} style={{ marginTop: 14, background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 20, color: "#fff", padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        + Neues Gericht
      </button>
    )}
  </div>

  {/* PLAN TAB */}
  {tab === "plan" && (
    <div style={{ padding: "16px 16px 0" }}>
      {DAYS.map((day, i) => {
        const dishId = weekPlan[i];
        const dish = dishes.find(d => d.id === dishId);
        return (
          <div key={i} style={{ background: "#fff", borderRadius: 16, marginBottom: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "12px 14px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: dish ? "linear-gradient(135deg, #FF6B35, #FF8C61)" : "#F2F2F7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginRight: 12, flexShrink: 0 }}>
                {dish ? dish.emoji : <span style={{ fontSize: 16 }}>📅</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{DAY_SHORT[i]}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: dish ? "#1C1C1E" : "#8E8E93", truncate: true, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {dish ? dish.name : "Kein Gericht geplant"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {dish && (
                  <button onClick={() => removeDishFromPlan(i)} style={{ background: "#FF3B30", border: "none", borderRadius: 8, color: "#fff", width: 30, height: 30, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                )}
                <button onClick={() => setShowDishPicker(i)} style={{ background: "#F2F2F7", border: "none", borderRadius: 8, color: "#FF6B35", width: 30, height: 30, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>+</button>
              </div>
            </div>
            {dish && (
              <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                {dish.ingredients.slice(0, 3).map((ing, j) => (
                  <span key={j} style={{ background: "#FFF0EB", color: "#FF6B35", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 500 }}>{ing.name}</span>
                ))}
                {dish.ingredients.length > 3 && <span style={{ background: "#F2F2F7", color: "#8E8E93", borderRadius: 8, padding: "2px 8px", fontSize: 11 }}>+{dish.ingredients.length - 3}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}

  {/* DISHES TAB */}
  {tab === "dishes" && (
    <div style={{ padding: "16px 16px 0" }}>
      {dishes.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#8E8E93" }}>
          <div style={{ fontSize: 50, marginBottom: 12 }}>🍽️</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Noch keine Gerichte</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Tippe auf "+ Neues Gericht" um zu starten</div>
        </div>
      )}
      {dishes.map(dish => (
        <button key={dish.id} onClick={() => setShowDishDetail(dish)} style={{ display: "flex", alignItems: "center", width: "100%", background: "#fff", border: "none", borderRadius: 16, marginBottom: 10, padding: "14px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textAlign: "left" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FF8C61)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginRight: 14, flexShrink: 0 }}>
            {dish.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1C1C1E" }}>{dish.name}</div>
            <div style={{ fontSize: 13, color: "#8E8E93", marginTop: 2 }}>{dish.ingredients.length} Zutaten</div>
          </div>
          {plannedDishIds.has(dish.id) && (
            <span style={{ background: "#E8F9F0", color: "#34C759", borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>Im Plan</span>
          )}
          <span style={{ color: "#C7C7CC", fontSize: 18, marginLeft: 8 }}>›</span>
        </button>
      ))}
    </div>
  )}

  {/* SHOPPING TAB */}
  {tab === "shopping" && (
    <div style={{ padding: "16px 16px 0" }}>
      {shoppingList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#8E8E93" }}>
          <div style={{ fontSize: 50, marginBottom: 12 }}>🛒</div>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Liste ist leer</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>Plane zuerst Gerichte für die Woche</div>
        </div>
      ) : (
        <>
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 12 }}>
            {shoppingList.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "13px 16px", borderBottom: i < shoppingList.length - 1 ? "1px solid #F2F2F7" : "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B35", marginRight: 12, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "#1C1C1E" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "#8E8E93", marginTop: 1 }}>{item.dishes.join(", ")}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#FF6B35" }}>
                  {item.amount % 1 === 0 ? item.amount : item.amount.toFixed(1)} {item.unit}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#8E8E93", textAlign: "center", paddingBottom: 8 }}>
            Basierend auf {Object.keys(weekPlan).length} geplanten Gerichten
          </div>
        </>
      )}
    </div>
  )}

  {/* Bottom Tab Bar */}
  <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,0,0,0.08)", display: "flex", padding: "8px 0 20px", zIndex: 100 }}>
    {[["plan","📅","Plan"],["dishes","🍽️","Gerichte"],["shopping","🛒","Einkauf"]].map(([id,ico,label]) => (
      <button key={id} onClick={() => setTab(id)} style={{ flex: 1, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0" }}>
        <span style={{ fontSize: 22 }}>{ico}</span>
        <span style={{ fontSize: 10, fontWeight: tab === id ? 700 : 400, color: tab === id ? "#FF6B35" : "#8E8E93" }}>{label}</span>
        {tab === id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF6B35", marginTop: 1 }} />}
      </button>
    ))}
  </div>

  {/* MODAL: Dish Picker */}
  {showDishPicker !== null && (
    <Modal onClose={() => setShowDishPicker(null)} title={`Gericht für ${DAYS[showDishPicker]}`}>
      {dishes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: "#8E8E93" }}>Keine Gerichte vorhanden</div>
      ) : (
        dishes.map(dish => (
          <button key={dish.id} onClick={() => selectDishForDay(showDishPicker, dish.id)} style={{ display: "flex", alignItems: "center", width: "100%", background: weekPlan[showDishPicker] === dish.id ? "#FFF0EB" : "#F8F8F8", border: "none", borderRadius: 12, marginBottom: 8, padding: "12px", cursor: "pointer" }}>
            <span style={{ fontSize: 22, marginRight: 12 }}>{dish.emoji}</span>
            <span style={{ fontSize: 15, fontWeight: 500, color: "#1C1C1E", flex: 1, textAlign: "left" }}>{dish.name}</span>
            {weekPlan[showDishPicker] === dish.id && <span style={{ color: "#FF6B35", fontSize: 16 }}>✓</span>}
          </button>
        ))
      )}
    </Modal>
  )}

  {/* MODAL: Dish Detail */}
  {showDishDetail && (
    <Modal onClose={() => setShowDishDetail(null)} title={`${showDishDetail.emoji} ${showDishDetail.name}`}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#8E8E93", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Zutaten</div>
        {showDishDetail.ingredients.map((ing, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < showDishDetail.ingredients.length - 1 ? "1px solid #F2F2F7" : "none" }}>
            <span style={{ fontSize: 15, color: "#1C1C1E" }}>{ing.name}</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#FF6B35" }}>{ing.amount} {ing.unit}</span>
          </div>
        ))}
      </div>
      <button onClick={() => deleteDish(showDishDetail.id)} style={{ width: "100%", background: "#FF3B30", border: "none", borderRadius: 12, color: "#fff", padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
        Gericht löschen
      </button>
    </Modal>
  )}

  {/* MODAL: Add Dish */}
  {showAddDish && (
    <Modal onClose={() => setShowAddDish(false)} title="Neues Gericht" tall>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, color: "#8E8E93", fontWeight: 600, display: "block", marginBottom: 6 }}>EMOJI</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, background: "#F8F8F8", borderRadius: 12, padding: 10 }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setNewDish(d => ({...d, emoji: e}))} style={{ fontSize: 22, background: newDish.emoji === e ? "#FF6B35" : "transparent", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer" }}>{e}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, color: "#8E8E93", fontWeight: 600, display: "block", marginBottom: 6 }}>NAME</label>
        <input value={newDish.name} onChange={e => setNewDish(d => ({...d, name: e.target.value}))} placeholder="z.B. Gemüsepfanne" style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1px solid #E5E5EA", fontSize: 15, boxSizing: "border-box", outline: "none" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontSize: 13, color: "#8E8E93", fontWeight: 600 }}>ZUTATEN</label>
          <button onClick={addIngredientRow} style={{ background: "#FFF0EB", border: "none", borderRadius: 8, color: "#FF6B35", padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Hinzufügen</button>
        </div>
        {newDish.ingredients.map((ing) => (
          <div key={ing.id} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
            <input value={ing.name} onChange={e => updateIngredient(ing.id, "name", e.target.value)} placeholder="Zutat" style={{ flex: 2, padding: "10px", borderRadius: 10, border: "1px solid #E5E5EA", fontSize: 13, outline: "none" }} />
            <input value={ing.amount} onChange={e => updateIngredient(ing.id, "amount", e.target.value)} placeholder="Menge" type="number" style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #E5E5EA", fontSize: 13, outline: "none" }} />
            <select value={ing.unit} onChange={e => updateIngredient(ing.id, "unit", e.target.value)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #E5E5EA", fontSize: 12, outline: "none", background: "#fff" }}>
              {["g","kg","ml","L","EL","TL","Stk","Bund","Prise","Zehen","Dose"].map(u => <option key={u}>{u}</option>)}
            </select>
            {newDish.ingredients.length > 1 && (
              <button onClick={() => removeIngredientRow(ing.id)} style={{ background: "none", border: "none", color: "#FF3B30", fontSize: 18, cursor: "pointer", padding: "4px", flexShrink: 0 }}>✕</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={saveDish} style={{ width: "100%", background: "linear-gradient(135deg, #FF6B35, #FF8C61)", border: "none", borderRadius: 12, color: "#fff", padding: "14px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
        Gericht speichern ✓
      </button>
    </Modal>
  )}

  {/* Toast */}
  {toast && (
    <div style={{ position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)", background: "rgba(28,28,30,0.9)", color: "#fff", borderRadius: 20, padding: "10px 20px", fontSize: 14, fontWeight: 500, zIndex: 999, backdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>
      {toast}
    </div>
  )}
</div>
```

);
}

function Modal({ onClose, title, children, tall }) {
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.45)”, display: “flex”, alignItems: “flex-end”, justifyContent: “center”, zIndex: 500 }} onClick={onClose}>
<div onClick={e => e.stopPropagation()} style={{ background: “#fff”, borderRadius: “24px 24px 0 0”, width: “100%”, maxWidth: 430, maxHeight: tall ? “90vh” : “75vh”, overflowY: “auto”, padding: “20px 20px 40px” }}>
<div style={{ width: 36, height: 4, background: “#E5E5EA”, borderRadius: 2, margin: “0 auto 20px” }} />
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 16 }}>
<div style={{ fontSize: 18, fontWeight: 700, color: “#1C1C1E” }}>{title}</div>
<button onClick={onClose} style={{ background: “#F2F2F7”, border: “none”, borderRadius: “50%”, width: 30, height: 30, fontSize: 16, cursor: “pointer”, color: “#8E8E93” }}>✕</button>
</div>
{children}
</div>
</div>
);
}
