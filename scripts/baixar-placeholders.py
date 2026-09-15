"""
Baixa as imagens PROVISORIAS do Unsplash usadas enquanto nao houver fotos reais
da barbearia.

IMPORTANTE: estas imagens NAO sao trabalho do Matheus. Elas existem apenas para
que o layout possa ser avaliado. Enquanto estiverem no ar, o site mostra um aviso
de "imagens ilustrativas" (config.js -> MODO_PROTOTIPO). Quando as fotos reais
chegarem, apague a pasta assets/placeholder/ inteira e desligue o modo prototipo.

Os IDs abaixo foram curados manualmente e cada um e verificado por HEAD antes do
download -- IDs raspados do Unsplash frequentemente retornam 404.

Rode da raiz do projeto:  python scripts/baixar-placeholders.py
"""

from pathlib import Path
import io
import urllib.request
import urllib.error

from PIL import Image, ImageEnhance

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "assets" / "placeholder"

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}
LARGURA = 1200
QUALIDADE = 80

# (id_unsplash, categoria, nome_arquivo, descricao_alt)
# categoria alimenta os filtros da galeria em js/content.js
CATALOGO = [
    ("photo-1599351431202-1e0f0137899a", "degrade",  "degrade-01", "Barbeiro finalizando um degrade com navalha"),
    ("photo-1657105052497-f996284ffff8", "degrade",  "degrade-02", "Barbeiro desbastando o cabelo com navalhete e pente"),
    ("photo-1648221122323-572c13a31663", "degrade",  "degrade-04", "Cliente tendo o cabelo cortado na cadeira"),

    ("photo-1593702295094-aea22597af65", "classico", "classico-04", "Barbeiro executando corte classico com tesoura"),
    ("photo-1593702275687-f8b402bf1fb5", "classico", "classico-02", "Barbeiro de camisa branca cortando cabelo"),
    ("photo-1598524374912-6b0b0bab43dd", "classico", "classico-03", "Atendimento em cadeira de barbeiro"),

    ("photo-1672642150228-3fcd5826ec26", "moderno",  "moderno-02", "Corte moderno sendo finalizado"),
    ("photo-1647140655214-e4a2d914971f", "moderno",  "moderno-04", "Corte sendo trabalhado com tesoura"),
    ("photo-1493256338651-d82f7acb2b38", "moderno",  "moderno-05", "Maquina de corte em uso"),
    ("photo-1635273051839-003bf06a8751", "degrade",  "degrade-05", "Detalhe do degrade sendo executado"),

    ("photo-1599011176306-4a96f1516d4d", "barba",    "barba-01", "Barbeiro aparando a barba com tesoura"),
    ("photo-1517832606299-7ae9b720a186", "barba",    "barba-02", "Acabamento de barba com tesoura, em preto e branco"),
    ("photo-1532710093739-9470acff878f", "barba",    "barba-04", "Acabamento de barba, em preto e branco"),

    ("photo-1704072650662-76df3af134a7", "infantil", "infantil-01", "Menino sendo atendido na cadeira da barbearia"),
    ("photo-1521490683712-35a1cb235d1c", "infantil", "infantil-02", "Crianca durante o corte de cabelo"),
    ("photo-1521490878864-a50e9fcb5718", "infantil", "infantil-03", "Barbeiro ajustando o cabelo de um menino"),
    ("photo-1788930045572-5be1e03c1433", "infantil", "infantil-04", "Crianca usando capa de barbeiro apos o corte"),

    ("photo-1503951914875-452162b0f3f1", "ambiente", "ambiente-01", "Cadeira de barbeiro em ambiente de barbearia"),
    ("photo-1605497788044-5a32c7078486", "ambiente", "ambiente-02", "Interior de barbearia"),
]


def url_do(uid: str) -> str:
    return f"https://images.unsplash.com/{uid}?w={LARGURA}&q=80&fm=jpg&fit=crop"


def verificar(uid: str) -> bool:
    """HEAD antes do download. IDs invalidos sao comuns e devem ser descartados."""
    req = urllib.request.Request(url_do(uid), headers=UA, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status == 200
    except urllib.error.HTTPError as e:
        print(f"    HEAD {e.code}")
        return False
    except Exception as e:
        print(f"    HEAD falhou: {e}")
        return False


def graduar(im: Image.Image) -> Image.Image:
    """
    Unifica 19 fotos de banco tiradas por 19 pessoas diferentes num conjunto que
    parece uma coisa so, e aproxima a temperatura delas da paleta areia/grafite
    do site. Sem isso a galeria le como colagem de stock.

    E aplicado apenas nos placeholders -- fotos reais da barbearia entram cruas.
    """
    im = ImageEnhance.Color(im).enhance(0.86)      # tira o excesso de saturacao do stock
    im = ImageEnhance.Contrast(im).enhance(1.06)

    # deslocamento quente: levanta o vermelho, segura o azul nas sombras
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v + 10 * (1 - v / 255) + 4)))
    g = g.point(lambda v: min(255, int(v + 3 * (1 - v / 255))))
    b = b.point(lambda v: max(0, int(v - 8 * (1 - v / 255) - 2)))
    return Image.merge("RGB", (r, g, b))


def baixar(uid: str, destino: Path) -> int:
    req = urllib.request.Request(url_do(uid), headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        dados = r.read()
    with Image.open(io.BytesIO(dados)) as im:
        graduar(im.convert("RGB")).save(destino, "WEBP", quality=QUALIDADE, method=6)
    return round(destino.stat().st_size / 1024)


if __name__ == "__main__":
    DESTINO.mkdir(parents=True, exist_ok=True)

    ok, falhas = [], []
    for uid, categoria, nome, alt in CATALOGO:
        print(f"  {nome} ({categoria})")
        if (DESTINO / f"{nome}.webp").exists():
            ok.append((uid, categoria, nome, alt))
            print("    ja existe, mantido")
            continue
        if not verificar(uid):
            falhas.append((nome, uid))
            print("    DESCARTADO")
            continue
        arquivo = DESTINO / f"{nome}.webp"
        try:
            peso = baixar(uid, arquivo)
            ok.append((uid, categoria, nome, alt))
            print(f"    -> {arquivo.name} ({peso} KB)")
        except Exception as e:
            falhas.append((nome, uid))
            print(f"    ERRO no download: {e}")

    creditos = [
        "# Imagens provisorias",
        "",
        "Fotos do Unsplash usadas **apenas como placeholder** enquanto nao ha fotos",
        "reais da Matheus Pereira Barbearia. Nenhuma delas retrata trabalho do Matheus.",
        "",
        "Licenca Unsplash: uso livre, sem necessidade de atribuicao.",
        "",
        "Para remover: apague esta pasta e defina `MODO_PROTOTIPO = false` em `js/config.js`.",
        "",
        "| Arquivo | Categoria | Origem |",
        "| --- | --- | --- |",
    ]
    for uid, categoria, nome, _alt in ok:
        creditos.append(f"| {nome}.webp | {categoria} | https://images.unsplash.com/{uid} |")

    (DESTINO / "CREDITS.md").write_text("\n".join(creditos) + "\n", encoding="utf-8")

    print(f"\n  {len(ok)} baixadas, {len(falhas)} descartadas.")
    if falhas:
        print("  Descartadas:", ", ".join(n for n, _ in falhas))
