"""
Organiza as imagens da barbearia.

1. Move os arquivos originais da raiz para assets/originais/ sem alterar nada.
2. Gera derivadas otimizadas em WebP (larguras 480/768/1020) para uso no site.
3. Imprime um relatorio com dimensoes e ganho de peso.

Requer Pillow. Rode da raiz do projeto:  python scripts/organizar-imagens.py
"""

from pathlib import Path
import shutil
import sys

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGINAIS = RAIZ / "assets" / "originais"
FOTOS = RAIZ / "assets" / "fotos"
BRAND = RAIZ / "assets" / "brand"

LARGURAS = (480, 768, 1020)
QUALIDADE = 82

# origem na raiz -> (pasta de destino da derivada, nome base)
MAPA = {
    "fachada.webp": (FOTOS, "fachada"),
    "interior.webp": (FOTOS, "interior"),
    "matheus.jpg": (FOTOS, "matheus"),
    "logo.webp": (BRAND, "logo-placa"),
}


def kb(caminho: Path) -> int:
    return round(caminho.stat().st_size / 1024)


def mover_originais() -> None:
    ORIGINAIS.mkdir(parents=True, exist_ok=True)
    for nome in MAPA:
        na_raiz = RAIZ / nome
        destino = ORIGINAIS / nome
        if destino.exists():
            # Ja organizado numa execucao anterior; descarta a copia solta da raiz.
            if na_raiz.exists():
                na_raiz.unlink()
                print(f"  ja existia em originais, removida da raiz: {nome}")
            continue
        if not na_raiz.exists():
            print(f"  AVISO: nao encontrado: {nome}", file=sys.stderr)
            continue
        shutil.move(str(na_raiz), str(destino))
        print(f"  movido para originais: {nome} ({kb(destino)} KB)")


def gerar_derivadas() -> None:
    for nome, (pasta, base) in MAPA.items():
        origem = ORIGINAIS / nome
        if not origem.exists():
            continue

        pasta.mkdir(parents=True, exist_ok=True)
        with Image.open(origem) as im:
            im = im.convert("RGB")
            largura_nativa, altura_nativa = im.size
            print(f"\n  {nome}  {largura_nativa}x{altura_nativa}  ({kb(origem)} KB)")

            # Nunca ampliar: uma largura maior que a nativa so geraria peso sem nitidez.
            alvos = [w for w in LARGURAS if w <= largura_nativa]
            if largura_nativa not in alvos:
                alvos.append(largura_nativa)

            for largura in sorted(alvos):
                altura = round(altura_nativa * largura / largura_nativa)
                saida = pasta / f"{base}-{largura}.webp"
                im.resize((largura, altura), Image.LANCZOS).save(
                    saida, "WEBP", quality=QUALIDADE, method=6
                )
                print(f"    -> {saida.name}  {largura}x{altura}  ({kb(saida)} KB)")


if __name__ == "__main__":
    print("Movendo originais...")
    mover_originais()
    print("\nGerando derivadas...")
    gerar_derivadas()
    print("\nConcluido.")
