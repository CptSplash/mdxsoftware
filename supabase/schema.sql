-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE project_status AS ENUM ('Tender','Active','Practical Completion','Defects','Closed');
CREATE TYPE project_type   AS ENUM ('Residential','Commercial','Renovation','Fit-out','Pod/Modular');
CREATE TYPE contract_type  AS ENUM ('Lump Sum','Cost-Plus','Schedule of Rates');
CREATE TYPE trade_type     AS ENUM ('Concretor','Framer','Electrician','Plumber','Tiler','Painter','Plasterer','Renderer','Roofer','Bricklayer','Cabinetmaker','Glazier','Landscaper','Other');
CREATE TYPE work_order_status AS ENUM ('Invited','Quoted','Accepted','On Site','Complete','Invoiced','Paid');
CREATE TYPE claim_status   AS ENUM ('Claimed','Scheduled','Paid','Disputed');
CREATE TYPE client_type    AS ENUM ('Owner-Builder','Developer','Council','Commercial');
CREATE TYPE tradie_status  AS ENUM ('Available','Busy','Do Not Use');
CREATE TYPE prelim_status  AS ENUM ('Not Started','In Progress','Complete');
CREATE TYPE weather_type   AS ENUM ('Sunny','Partly Cloudy','Overcast','Rain','Wind','Extreme');

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

-- clients
CREATE TABLE clients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  abn             TEXT,
  contact_person  TEXT NOT NULL DEFAULT '',
  phone           TEXT NOT NULL DEFAULT '',
  email           TEXT NOT NULL DEFAULT '',
  address         TEXT NOT NULL DEFAULT '',
  client_type     client_type NOT NULL DEFAULT 'Developer',
  notes           TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- projects
CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_number   TEXT NOT NULL UNIQUE,
  name             TEXT NOT NULL,
  type             project_type NOT NULL DEFAULT 'Residential',
  status           project_status NOT NULL DEFAULT 'Tender',
  contract_value   BIGINT NOT NULL DEFAULT 0,
  contract_type    contract_type NOT NULL DEFAULT 'Lump Sum',
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  site_address     TEXT NOT NULL DEFAULT '',
  percent_complete INTEGER NOT NULL DEFAULT 0 CHECK (percent_complete >= 0 AND percent_complete <= 100),
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  notes            TEXT NOT NULL DEFAULT '',
  accent_color     TEXT NOT NULL DEFAULT '#1E3A5F',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- tradies
CREATE TABLE tradies (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name    TEXT NOT NULL,
  trade_type       trade_type NOT NULL DEFAULT 'Other',
  contact_name     TEXT NOT NULL DEFAULT '',
  phone            TEXT NOT NULL DEFAULT '',
  email            TEXT NOT NULL DEFAULT '',
  abn              TEXT,
  licence_number   TEXT,
  licence_expiry   DATE,
  insurance_expiry DATE,
  rating           INTEGER NOT NULL DEFAULT 3 CHECK (rating >= 1 AND rating <= 5),
  notes            TEXT NOT NULL DEFAULT '',
  states           TEXT[] NOT NULL DEFAULT '{}',
  status           tradie_status NOT NULL DEFAULT 'Available',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER tradies_updated_at BEFORE UPDATE ON tradies FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- work_orders
CREATE TABLE work_orders (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tradie_id    UUID NOT NULL REFERENCES tradies(id) ON DELETE RESTRICT,
  scope        TEXT NOT NULL DEFAULT '',
  quoted_price BIGINT NOT NULL DEFAULT 0,
  start_date   DATE NOT NULL,
  duration     INTEGER NOT NULL DEFAULT 1,
  status       work_order_status NOT NULL DEFAULT 'Invited',
  notes        TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- payment_claims
CREATE TABLE payment_claims (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  claim_number  INTEGER NOT NULL,
  claim_date    DATE NOT NULL,
  claim_period  TEXT NOT NULL DEFAULT '',
  amount        BIGINT NOT NULL DEFAULT 0,
  retention_pct NUMERIC(5,2) NOT NULL DEFAULT 5,
  status        claim_status NOT NULL DEFAULT 'Claimed',
  due_date      DATE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, claim_number)
);
CREATE TRIGGER payment_claims_updated_at BEFORE UPDATE ON payment_claims FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- prelim_lines
CREATE TABLE prelim_lines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  budgeted    BIGINT NOT NULL DEFAULT 0,
  actual      BIGINT NOT NULL DEFAULT 0,
  status      prelim_status NOT NULL DEFAULT 'Not Started',
  notes       TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER prelim_lines_updated_at BEFORE UPDATE ON prelim_lines FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- diary_entries
CREATE TABLE diary_entries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  weather        weather_type NOT NULL DEFAULT 'Sunny',
  work_completed TEXT NOT NULL DEFAULT '',
  delays         TEXT NOT NULL DEFAULT '',
  visitors       TEXT NOT NULL DEFAULT '',
  has_issues     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER diary_entries_updated_at BEFORE UPDATE ON diary_entries FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes
CREATE INDEX ON projects(status);
CREATE INDEX ON projects(client_id);
CREATE INDEX ON work_orders(project_id);
CREATE INDEX ON work_orders(tradie_id);
CREATE INDEX ON payment_claims(project_id);
CREATE INDEX ON prelim_lines(project_id);
CREATE INDEX ON diary_entries(project_id);
CREATE INDEX ON diary_entries(date DESC);

-- Row Level Security (permissive for now — auth added later with Clerk)
ALTER TABLE clients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tradies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders   ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE prelim_lines  ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Open policies (replace with user-scoped policies when Clerk auth is added)
CREATE POLICY "allow all" ON clients        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON projects       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON tradies        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON work_orders    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON payment_claims FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON prelim_lines   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow all" ON diary_entries  FOR ALL USING (true) WITH CHECK (true);

-- gantt_task_overrides
CREATE TABLE gantt_task_overrides (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  path_id     TEXT NOT NULL,
  task_key    TEXT NOT NULL,
  start_date  DATE,
  end_date    DATE,
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, path_id, task_key)
);
CREATE TRIGGER gantt_task_overrides_updated_at BEFORE UPDATE ON gantt_task_overrides FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE gantt_task_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all" ON gantt_task_overrides FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX ON gantt_task_overrides(project_id, path_id);

-- schedule_milestones
CREATE TABLE schedule_milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  key         TEXT NOT NULL,
  label       TEXT NOT NULL,
  date        DATE,
  notes       TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, key)
);
CREATE TRIGGER schedule_milestones_updated_at BEFORE UPDATE ON schedule_milestones FOR EACH ROW EXECUTE FUNCTION set_updated_at();
ALTER TABLE schedule_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow all" ON schedule_milestones FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX ON schedule_milestones(project_id);

-- ============================================================
-- SEED DATA (mirrors mock-data.ts)
-- ============================================================

-- clients
INSERT INTO clients (id, name, abn, contact_person, phone, email, address, client_type, notes) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001','Landmark Homes Pty Ltd','51 824 753 556','James Whitfield','02 9881 4400','j.whitfield@landmarkhomes.com.au','12 Norwest Boulevard, Bella Vista NSW 2153','Developer','Preferred developer client. Payment always on time. Long-term relationship since 2019.'),
  ('a1b2c3d4-0001-0000-0000-000000000002','Cooper Street Commercial Pty Ltd','37 612 984 201','Priya Mehta','02 9319 7722','priya@cooperstcom.com.au','Level 4, 55 Cooper St, Surry Hills NSW 2010','Commercial','Office fitout specialist. Strict programme adherence required.'),
  ('a1b2c3d4-0001-0000-0000-000000000003','SA Housing Trust','18 463 829 100','Greg Paterson','08 8463 1200','g.paterson@sahousingtrust.sa.gov.au','91 Grenfell St, Adelaide SA 5000','Council','Government client. Tender pricing critical. Retainage held for 12 months.');

-- projects
INSERT INTO projects (id, project_number, name, type, status, contract_value, contract_type, start_date, end_date, site_address, percent_complete, client_id, notes, accent_color) VALUES
  ('b2c3d4e5-0002-0000-0000-000000000001','PRJ-2026-001','Kellyville Bathroom Pods','Pod/Modular','Active',185000000,'Lump Sum','2026-01-15','2026-09-30','Lot 42-45 Swift Parrot Close, Kellyville NSW 2155',65,'a1b2c3d4-0001-0000-0000-000000000001','Manufacture and install 48 modular bathroom pods for Landmark Homes estate. Steel-framed, tiled, fully plumbed.','#1E3A5F'),
  ('b2c3d4e5-0002-0000-0000-000000000002','PRJ-2026-002','Surry Hills Commercial Fitout','Fit-out','Active',42000000,'Lump Sum','2026-03-01','2026-07-31','Level 4, 55 Cooper St, Surry Hills NSW 2010',30,'a1b2c3d4-0001-0000-0000-000000000002','Level 4 office fitout. 1,200sqm open plan with 6 meeting rooms and end-of-trip facilities.','#0F766E'),
  ('b2c3d4e5-0002-0000-0000-000000000003','PRJ-2026-003','Allenby Gardens Townhouses','Residential','Tender',210000000,'Lump Sum','2026-10-01','2027-09-30','18 Charles St, Allenby Gardens SA 5009',0,'a1b2c3d4-0001-0000-0000-000000000003','8 x 3-bedroom townhouses. DA lodged Sep 2025. Awaiting approval.','#7C3AED');

-- tradies
INSERT INTO tradies (id, business_name, trade_type, contact_name, phone, email, abn, licence_number, licence_expiry, insurance_expiry, rating, notes, states, status) VALUES
  ('c3d4e5f6-0003-0000-0000-000000000001','Volt Force Electrical','Electrician','Steve Nguyen','0411 882 334','steve@voltforce.com.au','74 381 920 445','EC012834','2026-07-20','2026-12-15',4,'Excellent workmanship. Licence renewal pending — follow up end of June.',ARRAY['NSW'],'Busy'),
  ('c3d4e5f6-0003-0000-0000-000000000002','BlueLine Plumbing Solutions','Plumber','Marco Di Palma','0422 915 600','marco@bluelineplumbing.com.au','55 719 302 884','PL038821','2027-03-01','2026-11-30',5,'Best plumber on books. Always on time, great communication.',ARRAY['NSW','ACT'],'Available'),
  ('c3d4e5f6-0003-0000-0000-000000000003','RockSolid Concrete','Concretor','Dave Kouris','0437 551 209','d.kouris@rocksolidconcrete.com.au','29 504 671 338','BC022991','2027-06-10','2026-09-01',4,'Specialist in elevated slabs and basement work.',ARRAY['NSW','VIC'],'Available'),
  ('c3d4e5f6-0003-0000-0000-000000000004','Apex Framing & Carpentry','Framer','Tom Callaghan','0405 774 120','tom@apexframing.com.au','61 238 540 772','BC019044','2026-11-22','2026-08-01',5,'Expert in modular and pod framing systems.',ARRAY['NSW'],'Busy'),
  ('c3d4e5f6-0003-0000-0000-000000000005','Precision Tiling Co','Tiler','Yusuf Al-Rashid','0452 338 891','yusuf@precisiontiling.com.au','83 617 204 559',NULL,NULL,'2026-10-20',4,'Large format tile specialist. Slow on grouting but immaculate finish.',ARRAY['NSW','QLD'],'Available'),
  ('c3d4e5f6-0003-0000-0000-000000000006','Coastal Colour Painting','Painter','Rachel Stanton','0488 210 045','rachel@coastalcolour.com.au','47 902 834 610','PT008833','2027-02-14','2026-07-28',3,'Good on interiors. Insurance due for renewal — check before next project allocation.',ARRAY['NSW','VIC','SA'],'Available');

-- work_orders
INSERT INTO work_orders (id, project_id, tradie_id, scope, quoted_price, start_date, duration, status, notes) VALUES
  ('d4e5f6a7-0004-0000-0000-000000000001','b2c3d4e5-0002-0000-0000-000000000001','c3d4e5f6-0003-0000-0000-000000000002','Supply and install all plumbing rough-in for 48 bathroom pods including waste, hot and cold water services to AS3500.',38400000,'2026-02-10',28,'Complete','Completed ahead of schedule. Retention to be released at PC.'),
  ('d4e5f6a7-0004-0000-0000-000000000002','b2c3d4e5-0002-0000-0000-000000000001','c3d4e5f6-0003-0000-0000-000000000001','Install electrical fitout to all 48 pods including GPOs, lighting, exhaust fans, heat lamps and switchboards.',28800000,'2026-03-15',21,'On Site','Progress at 70%. Minor RFI raised on exhaust fan spec.'),
  ('d4e5f6a7-0004-0000-0000-000000000003','b2c3d4e5-0002-0000-0000-000000000001','c3d4e5f6-0003-0000-0000-000000000005','Supply and lay wall and floor tiles to all 48 pods. Large format 600x600 floor, 300x600 wall tiles.',22000000,'2026-04-20',30,'On Site','Currently laying floor tiles to batch 2. Grouting commences week 3.'),
  ('d4e5f6a7-0004-0000-0000-000000000004','b2c3d4e5-0002-0000-0000-000000000001','c3d4e5f6-0003-0000-0000-000000000004','Structural framing for all 48 steel-framed pod modules to engineering drawings.',44000000,'2026-01-20',18,'Complete','All frames signed off by structural engineer.'),
  ('d4e5f6a7-0004-0000-0000-000000000005','b2c3d4e5-0002-0000-0000-000000000002','c3d4e5f6-0003-0000-0000-000000000001','Full electrical fitout — power, data conduit, lighting, emergency systems to NCC BCA commercial requirements.',11200000,'2026-04-01',35,'Accepted','Awaiting access — current tenant vacating 28 March.'),
  ('d4e5f6a7-0004-0000-0000-000000000006','b2c3d4e5-0002-0000-0000-000000000002','c3d4e5f6-0003-0000-0000-000000000002','Plumbing fitout — kitchen, amenities, floor waste, HWS, backflow prevention.',5400000,'2026-04-08',20,'Quoted','Quote received, reviewing scope variation for extra toilet block.'),
  ('d4e5f6a7-0004-0000-0000-000000000007','b2c3d4e5-0002-0000-0000-000000000002','c3d4e5f6-0003-0000-0000-000000000006','Interior painting — all walls, ceilings, doors and frames. Dulux premium finish throughout.',3800000,'2026-06-15',14,'Invited','Invitation sent 10 June. Awaiting quote.');

-- payment_claims
INSERT INTO payment_claims (id, project_id, claim_number, claim_date, claim_period, amount, retention_pct, status, due_date) VALUES
  ('e5f6a7b8-0005-0000-0000-000000000001','b2c3d4e5-0002-0000-0000-000000000001',1,'2026-02-28','February 2026',46250000,5,'Paid','2026-03-28'),
  ('e5f6a7b8-0005-0000-0000-000000000002','b2c3d4e5-0002-0000-0000-000000000001',2,'2026-03-31','March 2026',55500000,5,'Claimed','2026-06-20'),
  ('e5f6a7b8-0005-0000-0000-000000000003','b2c3d4e5-0002-0000-0000-000000000002',1,'2026-04-30','April 2026',12600000,5,'Scheduled','2026-06-25');

-- prelim_lines (PRJ-2026-001)
INSERT INTO prelim_lines (id, project_id, category, description, budgeted, actual, status, notes, sort_order) VALUES
  ('f6a7b8c9-0006-0000-0000-000000000001','b2c3d4e5-0002-0000-0000-000000000001','Site Establishment','Site fencing, hoarding, signage, site shed and amenities',1800000,1920000,'Complete','Over budget due to council requirement for additional hoarding.',1),
  ('f6a7b8c9-0006-0000-0000-000000000002','b2c3d4e5-0002-0000-0000-000000000001','Temporary Services','Temp power, water, telecommunications connections',650000,610000,'Complete','',2),
  ('f6a7b8c9-0006-0000-0000-000000000003','b2c3d4e5-0002-0000-0000-000000000001','Crane & Lifting','Mobile crane hire for pod placement — 12 lifts',4200000,3950000,'In Progress','Under budget. 8 of 12 lifts complete.',3),
  ('f6a7b8c9-0006-0000-0000-000000000004','b2c3d4e5-0002-0000-0000-000000000001','Project Management','PM fees, site superintendent, site admin',7400000,7400000,'In Progress','',4),
  ('f6a7b8c9-0006-0000-0000-000000000005','b2c3d4e5-0002-0000-0000-000000000001','Insurance','Contract works, public liability, WC insurance',2100000,2100000,'Complete','',5),
  ('f6a7b8c9-0006-0000-0000-000000000006','b2c3d4e5-0002-0000-0000-000000000001','Compliance & Inspections','BCA compliance consultant, staged inspections',900000,1100000,'In Progress','Two additional inspections requested by certifier.',6),
  ('f6a7b8c9-0006-0000-0000-000000000007','b2c3d4e5-0002-0000-0000-000000000001','Waste Management','Skip bins, waste segregation, removal',480000,390000,'In Progress','',7),
  ('f6a7b8c9-0006-0000-0000-000000000008','b2c3d4e5-0002-0000-0000-000000000001','Safety','SWMS documentation, safety officer visits, PPE',550000,520000,'In Progress','',8),
  -- PRJ-2026-002
  ('f6a7b8c9-0006-0000-0000-000000000009','b2c3d4e5-0002-0000-0000-000000000002','Site Establishment','Hoardings, protection to existing fitout, signage',420000,380000,'Complete','',1),
  ('f6a7b8c9-0006-0000-0000-000000000010','b2c3d4e5-0002-0000-0000-000000000002','Temporary Services','Temp lighting, power boards, comms',180000,195000,'In Progress','Additional temp lighting required for inner zones.',2),
  ('f6a7b8c9-0006-0000-0000-000000000011','b2c3d4e5-0002-0000-0000-000000000002','Project Management','PM and site supervisor fees',1950000,975000,'In Progress','50% through project.',3),
  ('f6a7b8c9-0006-0000-0000-000000000012','b2c3d4e5-0002-0000-0000-000000000002','Insurance','Contract works and public liability',580000,580000,'Complete','',4),
  ('f6a7b8c9-0006-0000-0000-000000000013','b2c3d4e5-0002-0000-0000-000000000002','Compliance & Inspections','NCC BCA commercial compliance and certifier fees',320000,320000,'Not Started','',5),
  ('f6a7b8c9-0006-0000-0000-000000000014','b2c3d4e5-0002-0000-0000-000000000002','Waste Management','Demo waste, skip bins',150000,88000,'In Progress','',6),
  ('f6a7b8c9-0006-0000-0000-000000000015','b2c3d4e5-0002-0000-0000-000000000002','Safety','Safety plan, SWMS, first aid',95000,45000,'In Progress','',7),
  -- PRJ-2026-003 (all Not Started — Tender)
  ('f6a7b8c9-0006-0000-0000-000000000016','b2c3d4e5-0002-0000-0000-000000000003','Site Establishment','Fencing, site amenities, signage',850000,0,'Not Started','',1),
  ('f6a7b8c9-0006-0000-0000-000000000017','b2c3d4e5-0002-0000-0000-000000000003','Temporary Services','Temp power and water',320000,0,'Not Started','',2),
  ('f6a7b8c9-0006-0000-0000-000000000018','b2c3d4e5-0002-0000-0000-000000000003','Project Management','PM, site super, admin — 16 months',8800000,0,'Not Started','',3),
  ('f6a7b8c9-0006-0000-0000-000000000019','b2c3d4e5-0002-0000-0000-000000000003','Insurance','Contract works, PL, WC',2500000,0,'Not Started','',4),
  ('f6a7b8c9-0006-0000-0000-000000000020','b2c3d4e5-0002-0000-0000-000000000003','Compliance & Inspections','Building certifier, staged inspections',780000,0,'Not Started','',5),
  ('f6a7b8c9-0006-0000-0000-000000000021','b2c3d4e5-0002-0000-0000-000000000003','Waste Management','Skip bins, waste removal',420000,0,'Not Started','',6),
  ('f6a7b8c9-0006-0000-0000-000000000022','b2c3d4e5-0002-0000-0000-000000000003','Safety','SafeWork SA compliance, SWMS',360000,0,'Not Started','',7);

-- diary_entries
INSERT INTO diary_entries (id, project_id, date, weather, work_completed, delays, visitors, has_issues) VALUES
  ('a7b8c9d0-0007-0000-0000-000000000001','b2c3d4e5-0002-0000-0000-000000000001','2026-06-16','Partly Cloudy','Electrical rough-in complete pods 33–40. Tiling commenced pod 25. Plumbing final inspection pods 1–24 passed.','None','James Whitfield (Landmark) — site walk, satisfied with progress.',false),
  ('a7b8c9d0-0007-0000-0000-000000000002','b2c3d4e5-0002-0000-0000-000000000001','2026-06-13','Rain','Internal works only — electrical cabling pods 30–32. Pod frame QA audit completed by structural engineer.','Crane lift postponed — rescheduled Monday 16 June.','Council inspector — framing sign-off for batch 3.',true),
  ('a7b8c9d0-0007-0000-0000-000000000003','b2c3d4e5-0002-0000-0000-000000000001','2026-06-12','Sunny','Crane lift — pods 41–44 placed on footings. Tiling complete pods 20–24. Touch-up painting commenced.','None','None',false),
  ('a7b8c9d0-0007-0000-0000-000000000004','b2c3d4e5-0002-0000-0000-000000000002','2026-06-16','Overcast','Electrical conduit installation — zones A and B complete. Plumber on site for kitchen rough-in. Partition framing 60% complete.','None','Priya Mehta (Cooper Street) — design query on meeting room 2 partition height.',false),
  ('a7b8c9d0-0007-0000-0000-000000000005','b2c3d4e5-0002-0000-0000-000000000002','2026-06-14','Sunny','Demolition of existing partitions complete. New partition tracks installed. Electrical marked out zones A–D.','Asbestos report clearance delayed by 1 day — works paused in Zone C.','SafeWork inspector — routine site visit, no issues raised.',true),
  ('a7b8c9d0-0007-0000-0000-000000000006','b2c3d4e5-0002-0000-0000-000000000002','2026-06-12','Sunny','Strip out of existing ceiling tiles and services. Waste removal completed. Site clean and ready for partition works.','None','Fire services engineer — existing sprinkler system survey.',false);
