import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
assert.ok(process.env.DATABASE_URL, 'DATABASE_URL is required');
assert.ok(process.env.ADMIN_SESSION_SECRET, 'ADMIN_SESSION_SECRET is required');
const sql = neon(process.env.DATABASE_URL);
const base = process.env.TEST_BASE_URL || 'http://localhost:5173';
const marker = `integration-test-${randomUUID()}`;
const payload = {customerName: 'Integration Test', phone: '9000000000', occasion:'Wedding Ganga Aarti', eventDate:'2027-12-01',city:'Varanasi',pincode:'221001',notes:marker};
const headers = {'Content-Type':'application/json', Origin:base};
let id;
try {
  const invalid = await fetch(`${base}/api/bookings`,{method:'POST',headers,body:'{'});
  assert.equal(invalid.status,400,'Malformed JSON must return 400');
  const created = await fetch(`${base}/api/bookings`,{method:'POST',headers,body:JSON.stringify(payload)});
  assert.equal(created.status,201,'Create booking failed');
  const {reference} = await created.json();
  const tracked = await fetch(`${base}/api/bookings/track?reference=${reference}&phone=${payload.phone}`);
  assert.equal(tracked.status,200);
  const record = await tracked.json();
  id = record.booking.id;
  assert.equal(record.booking.notes,marker);
  assert.equal(record.history.length,1);
  console.log('PASS: booking creation, Neon persistence, initial history, tracking');
  const denied = await fetch(`${base}/api/admin/bookings/${id}`,{method:'PATCH',headers,body:JSON.stringify({status:'CONFIRMED'})});
  assert.equal(denied.status,401);
  const wrongPhone = await fetch(`${base}/api/bookings/track?reference=${reference}&phone=9000000001`);
  assert.equal(wrongPhone.status,404);
  console.log('PASS: unauthenticated update and incorrect tracking phone rejected');
  const encoded = Buffer.from(JSON.stringify({sub:'owner',exp:Math.floor(Date.now()/1000)+300})).toString('base64url');
  const signature = createHmac('sha256',process.env.ADMIN_SESSION_SECRET).update(encoded).digest('base64url');
  let cookie = `kaw_admin_session=${encoded}.${signature}`;
  if (process.env.TEST_ADMIN_PASSWORD) {
    const login = await fetch(`${base}/api/admin/login`, {
      method: 'POST', headers,
      body: JSON.stringify({password: process.env.TEST_ADMIN_PASSWORD}),
    });
    assert.equal(login.status, 200, 'Password login failed');
    cookie = login.headers.get('set-cookie').split(';')[0];
    console.log('PASS: password login');
  }
  const auth = {...headers,Cookie:cookie};
  const updated = await fetch(`${base}/api/admin/bookings/${id}`,{method:'PATCH',headers:auth,body:JSON.stringify({status:'CONFIRMED'})});
  assert.equal(updated.status,200,'Authenticated update failed');
  const final = await (await fetch(`${base}/api/bookings/track?reference=${reference}&phone=${payload.phone}`)).json();
  assert.equal(final.booking.status,'CONFIRMED');
  assert.equal(final.history.length,2);
  const dash = await fetch(`${base}/admin`,{headers:auth});
  assert.equal(dash.status,200);
  assert.ok((await dash.text()).includes(reference));
  console.log('PASS: owner session, dashboard data, status change and history');
} finally {
  await sql.transaction([
    sql`delete from booking_status_history where booking_id in (select id from bookings where notes=${marker})`,
    sql`delete from bookings where notes=${marker}`,
  ]);
  console.log('Synthetic test booking removed.');
}
