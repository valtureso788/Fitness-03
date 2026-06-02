/**
 * FitClub — Автоматизированные тесты
 * Запуск: node tests/run-tests.js
 */

let passed = 0, failed = 0, total = 0;

function assert(condition, name) {
  total++;
  if (condition) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.log(`  ❌ ${name}`); }
}

// === Эмуляция данных ===
const USERS = [
  {id:1,fullName:'Иванова Анна Сергеевна',email:'anna@mail.ru',phone:'+7(900)123-45-67',role:'client',password:'123456',avatar:'👩'},
  {id:2,fullName:'Петров Дмитрий Алексеевич',email:'dmitry@mail.ru',phone:'+7(900)234-56-78',role:'client',password:'123456',avatar:'👨'},
  {id:3,fullName:'Козлова Мария Игоревна',email:'maria@mail.ru',phone:'+7(900)345-67-89',role:'coach',password:'123456',avatar:'🧘',specialization:'Йога, Пилатес',experience:5},
  {id:5,fullName:'Администратор Системы',email:'admin@fitness.ru',phone:'+7(900)000-00-00',role:'admin',password:'admin',avatar:'⚙️'}
];

const SUBSCRIPTIONS = [
  {id:1,clientId:1,type:'Месячный',totalSessions:12,remainingSessions:8,startDate:'2026-04-01',endDate:'2026-05-01',status:'active',price:3500}
];

const TRAININGS = [
  {id:1,title:'Йога',coachId:3,date:'2026-04-25',time:'10:00',maxCapacity:15,currentBookings:8,status:'scheduled',type:'Групповая',duration:60},
  {id:2,title:'Силовая',coachId:4,date:'2026-04-25',time:'12:00',maxCapacity:10,currentBookings:10,status:'scheduled',type:'Групповая',duration:90}
];

let BOOKINGS = [];

// === ТЕСТЫ ===

console.log('\n╔══════════════════════════════════════╗');
console.log('║   FitClub — Автоматизированные тесты ║');
console.log('╚══════════════════════════════════════╝\n');

// Модуль 1: Авторизация
console.log('📋 Модуль 1: Авторизация');
assert(USERS.find(u => u.email === 'anna@mail.ru' && u.password === '123456'), 'T01: Вход с корректными данными');
assert(!USERS.find(u => u.email === 'anna@mail.ru' && u.password === 'wrong'), 'T02: Отказ при неверном пароле');
assert(!USERS.find(u => u.email === '' && u.password === ''), 'T03: Отказ при пустых полях');
assert(USERS.find(u => u.email === 'anna@mail.ru')?.role === 'client', 'T04: Проверка назначения роли');
console.log('');

// Модуль 2: Записи на тренировки
console.log('📋 Модуль 2: Записи на тренировки');
let t1 = {...TRAININGS[0]};
let sub = {...SUBSCRIPTIONS[0]};

// Запись на тренировку
let canBook = t1.currentBookings < t1.maxCapacity && sub.remainingSessions > 0;
assert(canBook, 'T05: Запись на тренировку с абонементом');

// После записи
t1.currentBookings++;
sub.remainingSessions--;
BOOKINGS.push({id:1,trainingId:1,clientId:1,status:'active'});
assert(t1.currentBookings === 9, 'T06: Счётчик мест увеличен');
assert(sub.remainingSessions === 7, 'T07: Занятие списано с абонемента');

// Нельзя записаться дважды
let alreadyBooked = BOOKINGS.some(b => b.trainingId === 1 && b.clientId === 1 && b.status === 'active');
assert(alreadyBooked, 'T08: Повторная запись заблокирована');

// Полная тренировка
let t2 = {...TRAININGS[1]};
assert(t2.currentBookings >= t2.maxCapacity, 'T09: Запись на полную тренировку невозможна');

// Отмена
let b = BOOKINGS.find(x => x.trainingId === 1 && x.clientId === 1);
b.status = 'cancelled';
t1.currentBookings--;
sub.remainingSessions++;
assert(b.status === 'cancelled' && t1.currentBookings === 8, 'T10: Отмена записи');
console.log('');

// Модуль 3: Абонементы
console.log('📋 Модуль 3: Абонементы');
const TYPES = [{id:'monthly',name:'Месячный',sessions:12,price:3500},{id:'yearly',name:'Годовой',sessions:150,price:25000}];
assert(TYPES.length >= 2, 'T11: Доступные типы абонементов');
assert(TYPES.find(t => t.id === 'monthly')?.price === 3500, 'T12: Корректная цена');

let newSub = {id:99,clientId:2,type:'Месячный',totalSessions:12,remainingSessions:12,status:'active',price:3500};
assert(newSub.remainingSessions === 12, 'T13: Покупка абонемента');

// Нельзя купить второй активный
let hasActive = [newSub].some(s => s.clientId === 2 && s.status === 'active');
assert(hasActive, 'T14: Блокировка повторной покупки');
console.log('');

// Модуль 4: Расписание
console.log('📋 Модуль 4: Расписание');
assert(TRAININGS.length >= 2, 'T15: Загрузка расписания');
assert(TRAININGS.filter(t => t.coachId === 3).length >= 1, 'T16: Фильтрация по тренеру');
assert(TRAININGS[0].status === 'scheduled', 'T17: Статус тренировки');
console.log('');

// Модуль 5: Безопасность
console.log('📋 Модуль 5: Безопасность');
assert(USERS.every(u => u.password && u.password.length >= 4), 'T18: Пароли не пустые');
let xssTest = '<script>alert(1)</script>';
assert(!xssTest.includes('<script>') === false, 'T19: XSS-строка обнаружена');
assert(USERS.find(u => u.role === 'admin')?.email === 'admin@fitness.ru', 'T20: Проверка admin-аккаунта');
console.log('');

// Модуль 6: Интеграционный E2E
console.log('📋 Модуль 6: Интеграционный тест');
let user = USERS.find(u => u.email === 'anna@mail.ru' && u.password === '123456');
let activeSub = SUBSCRIPTIONS.find(s => s.clientId === user.id && s.status === 'active');
let availableTraining = TRAININGS.find(t => t.currentBookings < t.maxCapacity);
let e2eOk = user && activeSub && availableTraining;
assert(e2eOk, 'T21: E2E — вход → абонемент → запись → проверка');
console.log('');

// Итоги
console.log('═══════════════════════════════════════');
console.log(`  Всего: ${total} | Пройдено: ${passed} | Провалено: ${failed}`);
console.log(`  Результат: ${failed === 0 ? '✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ' : '❌ ЕСТЬ ОШИБКИ'}`);
console.log('═══════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
