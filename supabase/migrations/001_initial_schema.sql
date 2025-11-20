-- Crear tabla profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'ca')),
  total_esmorzars INTEGER DEFAULT 0,
  total_bars INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Principiante',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla bars
CREATE TABLE IF NOT EXISTS bars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  municipality TEXT NOT NULL,
  province TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Crear tabla esmorzars
CREATE TABLE IF NOT EXISTS esmorzars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bar_id UUID NOT NULL REFERENCES bars(id),
  date DATE NOT NULL,
  bocadillo TEXT,
  gasto TEXT[],
  bebida TEXT,
  cafe TEXT,
  price DECIMAL(10,2),
  review TEXT,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar estadísticas del usuario
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_esmorzars = (
      SELECT COUNT(*) 
      FROM esmorzars 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    total_bars = (
      SELECT COUNT(DISTINCT bar_id)
      FROM esmorzars
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    level = CASE
      WHEN (SELECT COUNT(*) FROM esmorzars WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)) <= 5 THEN 'Principiante'
      WHEN (SELECT COUNT(*) FROM esmorzars WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)) <= 20 THEN 'Intermedio'
      ELSE 'Avanzado'
    END,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger al insertar esmorzar
CREATE TRIGGER trigger_update_stats_on_insert
AFTER INSERT ON esmorzars
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- Trigger al eliminar esmorzar
CREATE TRIGGER trigger_update_stats_on_delete
AFTER DELETE ON esmorzars
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'es')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

