package com.senai.pint.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.GlobalHistogramBinarizer;
import com.google.zxing.common.HybridBinarizer;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LeitorCodigoBarras {

    /** Tenta decodificar a imagem; se a foto estiver girada, testa as 4 rotações. */
    public Optional<String> ler(byte[] bytes) throws IOException {
        BufferedImage imagem = ImageIO.read(new ByteArrayInputStream(bytes));
        if (imagem == null) {
            return Optional.empty();
        }

        Map<DecodeHintType, Object> dicas = new EnumMap<>(DecodeHintType.class);
        dicas.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);
        dicas.put(DecodeHintType.POSSIBLE_FORMATS, List.of(
                BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E,
                BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.ITF));

        MultiFormatReader leitor = new MultiFormatReader();
        LuminanceSource fonte = new BufferedImageLuminanceSource(imagem);

        for (int giro = 0; giro < 4; giro++) {
            for (boolean hibrido : new boolean[]{true, false}) {
                Binarizer binarizador = hibrido ? new HybridBinarizer(fonte) : new GlobalHistogramBinarizer(fonte);
                try {
                    return Optional.of(leitor.decode(new BinaryBitmap(binarizador), dicas).getText());
                } catch (NotFoundException e) {
                    // tenta a próxima combinação
                } finally {
                    leitor.reset();
                }
            }
            if (!fonte.isRotateSupported()) {
                break;
            }
            fonte = fonte.rotateCounterClockwise();
        }
        return Optional.empty();
    }
}
