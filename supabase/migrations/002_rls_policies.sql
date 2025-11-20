-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE esmorzars ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para bars
CREATE POLICY "Anyone can view bars"
  ON bars FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create bars"
  ON bars FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own bars"
  ON bars FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own bars"
  ON bars FOR DELETE
  USING (auth.uid() = created_by);

-- Políticas para esmorzars
CREATE POLICY "Users can view own esmorzars"
  ON esmorzars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own esmorzars"
  ON esmorzars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own esmorzars"
  ON esmorzars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own esmorzars"
  ON esmorzars FOR DELETE
  USING (auth.uid() = user_id);

