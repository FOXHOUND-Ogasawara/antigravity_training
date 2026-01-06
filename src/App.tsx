import {
  Alert,
  Box,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import NewsCard from "./components/NewsCard";
import Sidebar from "./components/Sidebar";
import { fetchNews, type NewsItem } from "./services/rssService";

const drawerWidth = 280;

// New Year Theme (Oshogatsu)
const theme = createTheme({
  palette: {
    mode: "light", // Switch to light mode for the white/red aesthetic
    primary: {
      main: "#b71c1c", // Deep Red (Kouhaku - Red)
    },
    secondary: {
      main: "#ffd700", // Gold
    },
    background: {
      default: "#fffaf0", // Floral White (Washi paper feel)
      paper: "#ffffff",
    },
    text: {
      primary: "#3e2723", // Dark Brown/Black for softer contrast
    },
  },
  typography: {
    fontFamily: '"Shippori Mincho", "YuMincho", "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "0.05em",
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            linear-gradient(45deg, #fdfbf7 25%, transparent 25%, transparent 75%, #fdfbf7 75%, #fdfbf7),
            linear-gradient(45deg, #fdfbf7 25%, transparent 25%, transparent 75%, #fdfbf7 75%, #fdfbf7)
          `,
          backgroundPosition: '0 0, 20px 20px',
          backgroundSize: '40px 40px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid #ffd700", // Gold border
          background: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#b71c1c", // Red Sidebar
          color: "#ffffff",
          borderRight: "4px solid #ffd700", // Gold border line
        },
      },
    },
  },
});

function App() {
  const [searchQuery, setSearchQuery] = useState("Artificial Intelligence");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNews(searchQuery);
        setNews(data);
        if (data.length === 0) {
          setError(
            "ニュースが見つかりませんでした。別のキーワードで試してください。"
          );
        }
      } catch {
        setError("ニュースの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        getNews();
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
          }}
        >
          <Toolbar />

          <Container maxWidth="xl">
            <Typography
              variant="h4"
              gutterBottom
              component="div"
              sx={{
                mb: 4,
                color: "#b71c1c",
                textShadow: "1px 1px 0px #ffd700",
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              🎍 {searchQuery} ニュース 🎍
            </Typography>

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress color="secondary" />
              </Box>
            )}

            {error && !loading && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {!loading && !error && (
              <Grid container spacing={3}>
                {news.map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                    <NewsCard item={item} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
