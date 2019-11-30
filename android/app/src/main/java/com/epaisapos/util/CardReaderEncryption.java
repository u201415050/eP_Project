//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.epaisapos.util;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;


public class CardReaderEncryption {
    private static final String charSet = "UTF-8";
    private static final byte[] key = new byte[]{82, 84, 82, 73, 82, 68, 108, 111, 78, 69, 82, 111, 85, 122, 73, 122, 82, 70, 108, 109, 97, 69, 104, 108, 98, 87, 116, 84, 77, 48, 53, 109};
    private static final byte[] iv = new byte[]{90, 108, 108, 109, 97, 69, 104, 108, 82, 71, 48, 61};
    private static final byte[] algorithmName = new byte[]{82, 69, 86, 84, 90, 87, 82, 108};
    private static final byte[] decryptTransformation = new byte[]{82, 69, 86, 84, 90, 87, 82, 108, 76, 48, 78, 67, 81, 121, 57, 79, 98, 49, 66, 104, 90, 71, 82, 112, 98, 109, 99, 61};
    private static final byte[] encryptTransformation = new byte[]{82, 69, 86, 84, 90, 87, 82, 108, 76, 48, 78, 67, 81, 121, 57, 81, 83, 48, 78, 84, 78, 86, 66, 104, 90, 71, 82, 112, 98, 109, 99, 61};


    public static String encryptText(String plainText) {
        // ---- Use specified 3DES key and IV from other source --------------
        if (plainText == null)
            plainText = "";
        try {
            Cipher c3des = Cipher.getInstance(new String(Base64.decode(encryptTransformation)));
            SecretKeySpec myKey = new SecretKeySpec(new String(Base64.decode(key)).getBytes(), new String(Base64.decode(algorithmName)));
            IvParameterSpec ivParameterSpec = new IvParameterSpec(new String(Base64.decode(iv)).getBytes());
            c3des.init(Cipher.ENCRYPT_MODE, myKey, ivParameterSpec);
            byte[] cipherText = c3des.doFinal(plainText.getBytes());
            byte[] bytes = Base64.encode(cipherText);
            return enReplaceString(new String(bytes, charSet));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }


    public static String decryptKey(String plainText) {
        try {

            byte[] ivValue = new String(Base64.decode(iv)).getBytes(charSet);
            DESedeKeySpec keySpec = new DESedeKeySpec(new String(Base64.decode(key)).getBytes());
            IvParameterSpec iv = new IvParameterSpec(ivValue);
            SecretKey key = SecretKeyFactory.getInstance(new String(Base64.decode(algorithmName))).generateSecret(keySpec);
            Cipher cipher = Cipher.getInstance(new String(Base64.decode(decryptTransformation)));
            cipher.init(Cipher.DECRYPT_MODE, key, iv);
            byte[] input = Base64.decode(deReplaceString(plainText).getBytes());
            byte[] encrypted = cipher.doFinal(input);
            return new String(encrypted);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    private static String enReplaceString(String str) {


        String newString;
        char newChar = '-';
        char oldChar = '+';

        char newChar1 = ',';
        char oldChar1 = '=';

        char newChar2 = '_';
        char oldChar2 = '/';

        int numChar = str.length();
        char[] charArray = new char[numChar];

        str.getChars(0, numChar, charArray, 0);
        int i = 0, flag = 0, j = 0, k = 0;

        while (i < charArray.length) {
            if (charArray[i] == oldChar) {
                charArray[i] = newChar;
                flag = 1;
            }
            i++;
        }
        while (k < charArray.length) {
            if (charArray[k] == oldChar1) {
                charArray[k] = newChar1;
                flag = 1;
            }
            k++;
        }
        while (j < charArray.length) {
            if (charArray[j] == oldChar2) {
                charArray[j] = newChar2;
                flag = 1;
            }
            j++;
        }
        if (flag == 1) {

            newString = new String(charArray);

            return newString;
        }
        return str;
    }

    private static String deReplaceString(String str) {


        String newString;
        char oldChar = '-';
        char newChar = '+';

        char oldChar1 = ',';
        char newChar1 = '=';

        char oldChar2 = '_';
        char newChar2 = '/';

        int numChar = str.length();
        char[] charArray = new char[numChar];

        str.getChars(0, numChar, charArray, 0);
        int i = 0, flag = 0, j = 0, k = 0;

        while (i < charArray.length) {
            if (charArray[i] == oldChar) {
                charArray[i] = newChar;
                flag = 1;
            }
            i++;
        }
        while (k < charArray.length) {
            if (charArray[k] == oldChar1) {
                charArray[k] = newChar1;
                flag = 1;
            }
            k++;
        }
        while (j < charArray.length) {
            if (charArray[j] == oldChar2) {
                charArray[j] = newChar2;
                flag = 1;
            }
            j++;
        }
        if (flag == 1) {

            newString = new String(charArray);

            return newString;
        }
        return str;
    }


}
