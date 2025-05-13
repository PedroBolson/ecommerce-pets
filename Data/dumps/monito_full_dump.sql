--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Postgres.app)
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: dog_gender_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.dog_gender_enum AS ENUM (
    'Male',
    'Female'
);


ALTER TYPE public.dog_gender_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adoption_photo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adoption_photo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying NOT NULL,
    "altText" character varying,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    breed_id uuid
);


ALTER TABLE public.adoption_photo OWNER TO postgres;

--
-- Name: breed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.breed (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text
);


ALTER TABLE public.breed OWNER TO postgres;

--
-- Name: breed_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.breed_image (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying NOT NULL,
    "altText" character varying,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "breedId" uuid
);


ALTER TABLE public.breed_image OWNER TO postgres;

--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "fullName" character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    city character varying NOT NULL,
    state character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "interestUuid" character varying,
    "isDog" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: dog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dog (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sku character varying NOT NULL,
    gender public.dog_gender_enum NOT NULL,
    "ageInMonths" integer NOT NULL,
    size character varying,
    color character varying,
    price numeric(12,2) NOT NULL,
    vaccinated boolean DEFAULT false NOT NULL,
    dewormed boolean DEFAULT false NOT NULL,
    certification character varying,
    microchip boolean DEFAULT false NOT NULL,
    location character varying,
    "publishedDate" date,
    "additionalInfo" text,
    "breedId" uuid
);


ALTER TABLE public.dog OWNER TO postgres;

--
-- Name: pet_knowledge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pet_knowledge (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    summary character varying NOT NULL,
    content text NOT NULL,
    "imageUrl" character varying,
    category character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    breed_id uuid
);


ALTER TABLE public.pet_knowledge OWNER TO postgres;

--
-- Name: store_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text
);


ALTER TABLE public.store_category OWNER TO postgres;

--
-- Name: store_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sku character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "categoryId" uuid,
    size integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.store_item OWNER TO postgres;

--
-- Name: store_item_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_item_image (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying NOT NULL,
    "altText" character varying,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "itemId" uuid
);


ALTER TABLE public.store_item_image OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: adoption_photo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adoption_photo (id, url, "altText", "displayOrder", breed_id) FROM stdin;
3f0f5d92-c858-4a01-9036-fd7848303681	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0ntR1CI68a-QK3QfYmrW7VkiL1me4arkxUQ&s	Happy woman with their adopted Golden Retriever	1	163c5d00-8342-4d58-88c9-79e1df39fd37
bcb76dc0-7c1a-4660-a7d9-04cc0f8c516d	https://fotos.amomeupet.org/uploads/fotos/1686058930_647f37b281384_hd.jpeg	A kid whit their shih tzu dog	1	f077c919-9580-4d80-a51b-9f28eca3f1e3
e8e4e65d-7d51-4f7e-b4d6-bdf57c0bd05d	https://www.purina.co.uk/sites/default/files/2022-07/GettyImages-1185816870%20%281%29.jpg?h=082daa72&itok=fE6nOpiy	1321	2	163c5d00-8342-4d58-88c9-79e1df39fd37
4393ab0e-580d-4b72-886a-78373787443b	https://www.goldensunset.com.br/application/views/imagens/layout/img-quemsomos_destaque.jpg	Happy family with their golden	3	163c5d00-8342-4d58-88c9-79e1df39fd37
ba849e9b-ce3e-41a5-a37c-6d6cbf339eae	https://covey.org/wp-content/uploads/2023/10/people-petting-dog-in-group-therapy-session-922709444-5ba4047dc9e77c00501c4410-scaled.jpg	Golden	4	163c5d00-8342-4d58-88c9-79e1df39fd37
822271df-ee88-450f-b10c-50c03c66990d	https://ca-times.brightspotcdn.com/dims4/default/bf8678f/2147483647/strip/true/crop/5150x3432+0+88/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F36%2Fe3%2F82de1be44be49ba9ea921e6edffc%2F1310255-me-mayor-max1-mam.jpg	Happy family with golden	4	163c5d00-8342-4d58-88c9-79e1df39fd37
60a3bc63-af1e-49e3-b072-a0304600a460	https://s3.amazonaws.com/images.gearjunkie.com/uploads/2021/04/o.jpg	A golden retriever whit a duck	5	163c5d00-8342-4d58-88c9-79e1df39fd37
77086a1c-1913-4c7d-9961-3eb1ec2e6052	https://www.akc.org/wp-content/uploads/2018/01/retriever-paw-body.jpg	A golden retriever giving a hand	7	163c5d00-8342-4d58-88c9-79e1df39fd37
\.


--
-- Data for Name: breed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.breed (id, name, description) FROM stdin;
f077c919-9580-4d80-a51b-9f28eca3f1e3	Shih Tzu	A small, sturdy dog known for its luxurious, flowing double coat and sweet, affectionate nature
9bca9ff5-916e-4b3c-8355-8aada6c2738d	Bulldog	The Bulldog is a medium-sized, powerfully built dog with a broad chest, a distinctive “pushed-in” face, and characteristic loose, wrinkled skin. 
163c5d00-8342-4d58-88c9-79e1df39fd37	Golden Retriever	Friendly family dog with golden coat
18819860-fc23-4c27-8f2c-618b703994fb	Bull terrier	The Bull Terrier is a breed of dog in the terrier family. There is also a miniature version of this breed which is officially known as the Miniature Bull Terrier. This breed originates in 19th century England. Bull Terriers are most recognised by their unique head features. The Bull Terrier was originally bred for vermin control and bloodsports.
a89a01bc-d5aa-43ad-9c7c-8b27c12eb3ee	Border collie	The Border Collie is a British breed of herding dog of the collie type of medium size. It originates in the region of the Anglo-Scottish border, and descends from the traditional sheepdogs once found all over the British Isles. It is kept mostly as a working sheep-herding dog or as a companion animal.[1] It competes with success in sheepdog trials. It has been claimed that it is the most intelligent breed of dog
6591dc97-8116-4af1-96fe-b4648b9d1de3	Akita Inu	The Akita is a powerful, dominant, and loyal breed, commonly aloof with strangers, but affectionate and deeply loyal to its family. As a breed, Akitas are generally hardy. However, it is subject to debate as to whether the Akita strains are distinct, or if they constitute one breed.
9c5b564e-99f7-4a1d-8242-6c1e384b6675	Beagle	The Beagle is a small breed of scent hound, similar in appearance to the much larger foxhound. The beagle was developed primarily for hunting rabbit or hare, known as beagling. Possessing a great sense of smell and superior tracking instincts, the Beagle is the primary breed used as a detection dog for prohibited agricultural imports and foodstuffs in quarantine around the world. The beagle is a popular pet due to its size and good temper.
9cac1ee3-083f-4c6e-9f73-ce895c728d8f	Yorkshire Terrier	The Yorkshire Terrier, also known as a Yorkie, is a British breed of toy dog of terrier type. It is among the smallest of the terriers and indeed of all dog breeds, with a weight of no more than 3.2 kg (7 lb)
e07d2002-78e2-4551-b375-a9aa67f42aff	Siberian Husky	The Siberian Husky is a breed of medium-sized working sled dog. The breed belongs to the Spitz genetic family. It is recognizable by its thickly furred double coat, erect triangular ears, and distinctive markings, and is smaller than the similar-looking Alaskan Malamute.
add94ccd-5f65-4af3-bef9-98b839277b32	Chihuahua	The Chihuahua (or Spanish: Chihuahueño) is a Mexican breed of toy dog. It is named for the Mexican state of Chihuahua and is one of the smallest dog breeds in the world. It is usually kept as a companion animal.
de4c7bd0-2d22-4929-ab00-8f751c22a21f	Pug	The Pug is a breed of dog with the physically distinctive features of a wrinkly, short-muzzled face, and curled tail. An ancient breed, with roots dating back to 400 B.C., they have a fine, glossy coat that comes in a variety of colors, most often fawn (light brown) or black, and a compact, square body with well developed and thick muscles all over the body.
87ddeda4-5940-409b-900a-2ab2b4a7547b	Shiba Inu	The Shiba Inu (柴犬, Japanese pronunciation: [ɕi.ba.i.nɯ]) is a breed of hunting dog from Japan. A small-to-medium breed, it is the smallest of the six original dog breeds native to Japan. The Shiba Inu was originally bred for hunting.Its name literally translates to "brushwood dog", as it is used to flush game.
bf133f2d-7dfd-450f-8b0e-42cad75bcb48	Samoyed	The Samoyed (/ˈsæməjɛd/ SAM-ə-yed or /səˈmɔɪ.ɛd/ sə-MOY-ed; Russian: самое́дская соба́ка, romanized: samoyédskaya sobáka, or самое́д, samoyéd) is a breed of medium-sized herding dogs with thick, white, double-layer coats. They are spitz-type dogs which take their name from the Samoyedic peoples of Siberia. Descending from the Nenets Herding Laika, they are domesticated animals that assist in herding, hunting, protection and sled-pulling.
93a028a7-ee61-4f99-8afd-cbddbc0e4882	Pembroke Welsh Corgi	The Pembroke Welsh Corgi (/ˈkɔːrɡi/; Welsh for "dwarf dog") is a cattle herding dog breed that originated in Pembrokeshire, Wales. The name Corgi is of Welsh origin, and is a compound of the words cor and ci (mutated to gi), meaning "dwarf" and "dog", respectively. It is one of two breeds known as a Welsh Corgi, the other being the Cardigan Welsh Corgi. Pembroke Welsh Corgis are descended from the Spitz family of dog.
df0d779e-740f-427b-9d1b-ab91e61d6559	Chow Chow	The Chow Chow is a spitz-type of dog breed originally from Northern China. The Chow Chow is a sturdily built dog, square in profile, with a broad skull and small, triangular, erect ears with rounded tips. The breed is known for a very dense double coat that is either smooth or rough.: 4–5  The fur is particularly thick in the neck area, giving it a distinctive ruff or mane appearance. The coat may be shaded/self-red, black, blue, cinnamon/fawn, or cream.
b86a5dff-a806-44dd-ade5-18633e97c2f8	Cocker Spaniel	The English Cocker Spaniel is a breed of gun dog. It is noteworthy for producing one of the most varied numbers of pups in a litter among all dog breeds. The English Cocker Spaniel is an active, good-natured, sporting dog[1] standing well up at the withers and compactly built.
\.


--
-- Data for Name: breed_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.breed_image (id, url, "altText", "displayOrder", "breedId") FROM stdin;
456e47c4-ce01-4c65-96c9-255e12125cc2	https://images.ctfassets.net/aynow2efrlx4/3h99WRsJ0u4FxiXPyftARf/90babbe54dd5bc78e8818690a9dc2ffd/Canva_-_Bull_Terrier_puppy_running.jpg?w=1000&h=1000	Bull terrier puppy	2	18819860-fc23-4c27-8f2c-618b703994fb
cec6f923-6d60-44bb-a9ed-32627d6531ba	https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2020/07/09151754/Golden-Retriever-puppy-standing-outdoors.jpg	golden retriever puppy	2	163c5d00-8342-4d58-88c9-79e1df39fd37
993cae92-29fd-40e5-9c6c-a7518fa5362b	https://www.animalfactsencyclopedia.com/images/border-collie-puppy.jpg	Boder collie puppy	2	a89a01bc-d5aa-43ad-9c7c-8b27c12eb3ee
4b50840b-2e6a-44ac-81f4-c61621473883	https://i.ytimg.com/vi/S-f5uvHENYc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCu_9neVn4X6WtFtsIBkdD4r-GnfQ	shih tzu	2	f077c919-9580-4d80-a51b-9f28eca3f1e3
3e452e24-6e65-4bc7-8f1d-9aa51fa43e35	https://i.pinimg.com/564x/bb/de/60/bbde60804edcf595bdc625ecec49b147.jpg	shih tzu	3	f077c919-9580-4d80-a51b-9f28eca3f1e3
2279ddca-856c-4704-8330-d8f9e8148c88	https://www.akc.org/wp-content/uploads/2020/11/Japanese-Akitainu-puppy-playing-in-the-grass.jpg	Akita Inu	0	6591dc97-8116-4af1-96fe-b4648b9d1de3
baf80b25-27ed-4b8e-bc3f-4a866fb2cef2	https://i.pinimg.com/originals/17/6a/ba/176abaddfd84aed8e0089a1647af0755.jpg	Akita Inu	1	6591dc97-8116-4af1-96fe-b4648b9d1de3
2c9b8f53-6de8-4970-a90b-5cc4c85e2691	https://i.pinimg.com/736x/c7/f2/e9/c7f2e9fe8572eeb84b0764e169735023.jpg	Akita Inu	2	6591dc97-8116-4af1-96fe-b4648b9d1de3
96a72731-6781-40c6-ab31-5c8daf102b9d	https://cdn.royalcanin-weshare-online.io/TD9-7XoBRYZmsWpc-Lca/v3/bp-lot-2-beagle-couleur-human	Beagle playing	0	9c5b564e-99f7-4a1d-8242-6c1e384b6675
29b6810e-6a32-4d31-9333-71143f20bd66	https://www.akc.org/wp-content/uploads/2021/01/Beagle-puppy-standing-in-the-grass-1-500x486.jpeg	Beagle puppy	1	9c5b564e-99f7-4a1d-8242-6c1e384b6675
4a5e9516-f48e-4fc5-9121-affc4a52f00c	https://i.pinimg.com/736x/a2/41/bf/a241bf580bd666a05de1fa3b53f973e7.jpg	Beagle Puppy	2	9c5b564e-99f7-4a1d-8242-6c1e384b6675
742a40a6-0275-43cd-a669-002b6aafe501	https://premierpups.com//azure/premierphotos/pups/yorkshire-terrier-bella-8710698797313922.jpg	Yorkshire terrier	0	9cac1ee3-083f-4c6e-9f73-ce895c728d8f
4330d281-18bd-4120-8a89-026a8a7545ba	https://res.cloudinary.com/lancaster-puppies-laravel/image/upload/v1670954558/breeds/bfyjwx2w6fuusdcmlsgv.jpg	Yorkshire Terrier	1	9cac1ee3-083f-4c6e-9f73-ce895c728d8f
504c75b8-f296-4582-9164-2d8e0c157a79	https://www.akc.org/wp-content/uploads/2020/07/Yorkshire-Terrier-puppy-in-a-dog-bed.20200601164413905.jpg	Yorkshire Terrier	2	9cac1ee3-083f-4c6e-9f73-ce895c728d8f
13537c63-e383-4294-96e3-1485a86344df	https://cdn.abcotvs.com/dip/images/432731_121114-BulldogPuppy.jpg	Bulldog puppy	1	9bca9ff5-916e-4b3c-8355-8aada6c2738d
e46a959d-7717-4439-bde2-0db810b1e0e8	https://t3.ftcdn.net/jpg/00/79/31/34/360_F_79313453_1ld7t1eBHBP0GZUIxLaSJuAD08bbIB09.jpg	Siberian Husky	0	e07d2002-78e2-4551-b375-a9aa67f42aff
5f84cd44-ee7c-4adf-bf24-22c4953b8244	https://cdn05.zipify.com/KfV-u5ad3MpBENtObk8fMhK4BxQ=/fit-in/3840x0/acce0897e4c64dc9aab5e79b7fbf5351/17.jpeg	Chihuahua	0	add94ccd-5f65-4af3-bef9-98b839277b32
018a9b54-6c54-4547-9232-1a193f397e58	https://cobasiblog.blob.core.windows.net/production-ofc/2020/12/pug-filhote-capa.png	Pug	0	de4c7bd0-2d22-4929-ab00-8f751c22a21f
3bec67d8-54cd-4089-a2b2-f07af8000bce	https://i.pinimg.com/564x/f5/80/8e/f5808e68304fb8b44c8b6ed95d589e2c.jpg	Shiba Inu	0	87ddeda4-5940-409b-900a-2ab2b4a7547b
ff052cf1-b9a3-4e6b-ab5f-afa6f1d805f1	https://diariodonordeste.verdesmares.com.br/image/contentid/policy:1.3199960:1646403454/Samoieda-5.JPG?f=default&$p$f=f501f11	Samoyed	0	bf133f2d-7dfd-450f-8b0e-42cad75bcb48
f32dcdbc-3dca-4e6e-9165-fbf8af4c0dce	https://t3.ftcdn.net/jpg/02/74/06/48/360_F_274064877_Tuq84kGOn5nhyIJeUFTUSvXaSeedAOTT.jpg	Corgi	0	93a028a7-ee61-4f99-8afd-cbddbc0e4882
b5a186bc-abd1-44cf-809a-ad4d00abe159	https://www.dogster.com/wp-content/uploads/2015/05/chow-chow-puppies-01.jpg	Chow Chow	0	df0d779e-740f-427b-9d1b-ab91e61d6559
3b54e699-a0f8-4ed4-8f13-5c8e003caf37	https://img.freepik.com/fotos-gratis/filhote-de-cocker-spaniel-ingles-fofo-e-fofo-em-pe-sobre-uma-superficie-de-madeira-branca_181624-44467.jpg?semt=ais_hybrid&w=740	Cocker Spaniel	0	b86a5dff-a806-44dd-ade5-18633e97c2f8
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id, "fullName", phone, email, city, state, "createdAt", "isActive", "interestUuid", "isDog") FROM stdin;
951477b5-704d-467c-a021-5820d486ce81	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:15.833051	f	c420a32d-5753-496a-909c-58423aec6782	f
7c793e18-5198-48fa-8a70-2c7d35749e45	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:16.258041	f	c420a32d-5753-496a-909c-58423aec6782	f
e1c3383d-2d92-4f0e-86a5-454d109c04d7	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:19.127808	f	c420a32d-5753-496a-909c-58423aec6782	f
08095e86-6cdf-4995-836c-cc2eeb7f9972	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:13.534206	f	c420a32d-5753-496a-909c-58423aec6782	f
7278bcc2-05ce-4f3b-8618-fc83f41fa2eb	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:14.420943	f	c420a32d-5753-496a-909c-58423aec6782	f
320b362c-7ac6-48ec-a0fb-6d8eee1acc68	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-04 15:51:06.699275	f	c420a32d-5753-496a-909c-58423aec6782	f
8803be74-dbb0-4ea6-8db5-c6eb041dd93f	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:21.78167	f	c420a32d-5753-496a-909c-58423aec6782	f
32dd939e-38dd-4fbf-9518-03a55a49b7cd	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:17.574201	f	c420a32d-5753-496a-909c-58423aec6782	f
6c67164c-5373-4843-af2a-1a535883f51b	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:21.266548	f	c420a32d-5753-496a-909c-58423aec6782	f
3bf43399-fca0-447a-a7d6-19046cbfbcfd	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:15.193265	f	c420a32d-5753-496a-909c-58423aec6782	f
73fab607-e078-41a9-9a21-194858a97c7e	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:16.114263	f	c420a32d-5753-496a-909c-58423aec6782	f
c4e9d757-3864-4c23-a868-2c94bb25925a	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:18.329492	f	c420a32d-5753-496a-909c-58423aec6782	f
91b35309-b337-4b4d-ae2e-e20eec710e72	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 11:48:06.204643	f	c420a32d-5753-496a-909c-58423aec6782	f
7f85fe4a-9c1b-4656-b050-b4d5abae8d41	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 11:48:05.842472	f	c420a32d-5753-496a-909c-58423aec6782	f
22f2acea-3492-4e74-8bd4-169cbc9a66e9	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 11:47:55.632026	f	c420a32d-5753-496a-909c-58423aec6782	f
bf3c639b-1761-41e1-975c-7bf03dbcbc06	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:20.740871	f	c420a32d-5753-496a-909c-58423aec6782	f
a1f31034-13ea-4703-92c6-3236495ecf2c	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:20.182978	f	c420a32d-5753-496a-909c-58423aec6782	f
9530740b-a01a-462f-86d2-898a7888825a	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:19.620118	f	c420a32d-5753-496a-909c-58423aec6782	f
4a9c4e6a-5d8d-4f80-8bf1-26ef537fdb69	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 10:21:19.00601	f	c420a32d-5753-496a-909c-58423aec6782	f
0f9c414f-2b64-4879-9e51-500fa5c52116	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:14.963974	f	c420a32d-5753-496a-909c-58423aec6782	f
111886c6-166e-469d-86ca-24ee9286a5cd	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:15.408752	f	c420a32d-5753-496a-909c-58423aec6782	f
c27bd8d8-eb7e-43d9-8fad-1a5f02e57760	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-04 14:49:28.557295	f	176dfdb1-8547-4343-94cd-ff299e6d4cc6	t
e61fd527-e808-4147-9ded-ace0d030d024	Pedro Teste	(55)99923-1234	teste@pedro.com	Caxias do sul	Rio Grande do Sul	2025-05-09 15:29:34.233596	f	\N	t
0959edcf-d00f-4ccf-b1fb-fd37a48cdffe	Marina Mazuchini	(54) 12319319331	Teste@marina.com	Caxias do Sul	RS	2025-05-11 22:20:53.603266	t	3f180ed5-b52e-407c-a02b-dcb7d6a22320	t
7361c5e5-e948-4a87-8827-ab36296a47e0	Mark Zuckerberg	(555) 1234-321	markinhodelas@hotmail.com	Los Angeles	LA	2025-05-11 22:25:18.879249	t	c420a32d-5753-496a-909c-58423aec6782	f
b3c0eb4a-efcf-4f43-9fb6-05c1e137f288	Teste	(55) 99980-9544	teste@testing.com	Caxias do sul	RS	2025-05-11 21:51:13.805595	f	2c74d27b-eefc-4d94-9fa8-71c81ca85cae	t
a0b0ba99-e2f9-4c15-a033-c4e8d43ebb85	Pedro Bolson	(55) 99980-4312	teste@youtest.com	Porto Alegre	RS	2025-05-11 22:00:12.084384	f	27a15f0c-4d09-428e-a082-eb059738cb78	t
17c33652-18e5-4acf-b9c1-ae6b957e6c6f	Test from header	1234123145	testin@header.com	Caxias do sul	RS	2025-05-11 22:10:01.867672	f	\N	t
d6be7f4d-dd7a-409b-be66-83efcdf424fb	Alan Turing	(12) 12345-4569	alan@gmail.com	Los Angeles	LA	2025-05-11 22:02:32.191543	f	20d3b36b-15fe-42e3-b6cf-cf0c3abe2bb9	t
5c7c3035-fa5d-4026-a913-3feb4df919ef	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:16.62821	f	c420a32d-5753-496a-909c-58423aec6782	f
a2499838-9c1c-4e21-9074-abfd6a66c14e	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:16.992027	f	c420a32d-5753-496a-909c-58423aec6782	f
49b82aee-83f4-45c4-a19e-f130d8c7ab3d	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:17.345839	f	c420a32d-5753-496a-909c-58423aec6782	f
b0b34a2b-abbb-4893-bb10-3fb5cac430c8	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:17.734849	f	c420a32d-5753-496a-909c-58423aec6782	f
a88e8c45-07b5-4390-b2a7-b938c6ac792b	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:18.390581	f	c420a32d-5753-496a-909c-58423aec6782	f
d8f4ac90-16c9-4685-88f6-6b5300c87cd3	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:18.059052	f	c420a32d-5753-496a-909c-58423aec6782	f
d015d64c-4eac-42b1-a2b8-ce75191d94da	Pedro Bolson	(11) 99999-9999	pedro@gmail.com	Caxias do Sul	RS	2025-05-07 13:33:18.758344	f	c420a32d-5753-496a-909c-58423aec6782	f
4c378885-f92a-42e9-bebb-3bf1796a8ce0	Bill Gates	(123) 3214-321	Billinho@mslixo.com	Whashington	DC	2025-05-11 22:33:58.293848	t	\N	t
cf5089ac-21d7-4f04-9dba-8bd2b8db59e8	teste	12341251241	teste@novaanimacao.com	etste	teste	2025-05-11 22:14:16.8119	f	\N	t
6793fb35-ae97-4ba3-85bb-ff8afe6f27d2	Teste 2	54 3188318318	teste@teste.com	Tesx	tsrs	2025-05-11 22:21:18.933576	f	\N	t
a0d5d8ec-1286-41ea-a890-ac6940af8c8e	I Want SuperFood	(512) 1234-4432	Superfoods@gmail.com	Veneza	Italy	2025-05-12 07:46:46.591683	t	869d6177-e69d-4467-9567-88fc80567912	f
d5942b82-c9e7-4155-a646-d6a0e5e41da6	Teste	112371237613	paea@teste.com	371yadgs	agseyeas	2025-05-12 08:38:18.499158	t	\N	t
1ac41e56-3a54-4d03-8cf0-ce9cdebf6e25	Pedro	1123817318	teste@teste.com	yagyagry	yraygasra	2025-05-12 08:44:24.896167	t	20138c1e-272a-44e4-8ec0-9738ad7d3bcd	t
140b39e8-c240-44ce-81c5-bb9f9f2ab973	TEste	12312341	teste@teste.com	teste	RS	2025-05-12 10:39:38.194587	t	e07a51b5-316a-4c84-be33-d8ecbcff06aa	t
\.


--
-- Data for Name: dog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dog (id, sku, gender, "ageInMonths", size, color, price, vaccinated, dewormed, certification, microchip, location, "publishedDate", "additionalInfo", "breedId") FROM stdin;
176dfdb1-8547-4343-94cd-ff299e6d4cc6	BD-0021	Male	2	Medium	Brown	7400000.00	t	t		f	Porto Alegre, BR	2025-05-04		9bca9ff5-916e-4b3c-8355-8aada6c2738d
e07a51b5-316a-4c84-be33-d8ecbcff06aa	GR-0011	Male	4	Large	Golden	9200000.00	t	t	CBKC	t	Caxias do sul, BR	2025-04-30	Golden Retrievers are affectionate, intelligent, and easy to train. They’re perfect for families, great with children, and get along well with other pets. Energetic and playful, they enjoy fetch, swimming, and outdoor walks.	163c5d00-8342-4d58-88c9-79e1df39fd37
d29efd90-18f4-4f95-9d9f-16c87c89097c	BT-0055	Female	1	Medium	White	8700000.00	t	t	CBCK	t	Rio de Janeiro, RJ	2025-05-06		18819860-fc23-4c27-8f2c-618b703994fb
27a15f0c-4d09-428e-a082-eb059738cb78	BD-0112	Female	3	Large	Black & White	10924000.00	t	t	CBCK	t	São Paulo, SP	2025-05-06		a89a01bc-d5aa-43ad-9c7c-8b27c12eb3ee
443e70c3-aeca-43c4-b347-1720f54841bd	AI-0001	Female	1	Large	Cream	12099999.00	t	t	FCI	t	Tokio, Japan	2025-05-06		6591dc97-8116-4af1-96fe-b4648b9d1de3
2c74d27b-eefc-4d94-9fa8-71c81ca85cae	BE-0044	Male	12	Medium	Brown & White	9870000.00	t	t	CBCK	t	Curitiba, PR	2025-05-06		9c5b564e-99f7-4a1d-8242-6c1e384b6675
6f7a3e95-b0a8-437c-b401-92eae7e371ca	YT-0042	Female	3	Small	Black	6000000.00	t	t	CBCK	t	Manaus, AM	2025-05-06		9cac1ee3-083f-4c6e-9f73-ce895c728d8f
0cfcb9fb-71ef-47db-bc87-2c6034df5309	SH-0023	Male	2	Large	Black & White	15000000.00	t	t	CBCK	t	Búzios, RJ	2025-05-07		e07d2002-78e2-4551-b375-a9aa67f42aff
20138c1e-272a-44e4-8ec0-9738ad7d3bcd	CA-0014	Female	5	Small	Brown	6500000.00	t	t	FCK	t	Tókio, Japan	2025-05-07		add94ccd-5f65-4af3-bef9-98b839277b32
849aba08-5683-4db9-9893-c4c7cb31db09	PG-0123	Male	5	Small	Cream	9200000.00	t	t	CBKC	t	Salvador, BA	2025-05-07		de4c7bd0-2d22-4929-ab00-8f751c22a21f
3f180ed5-b52e-407c-a02b-dcb7d6a22320	SI-0012	Female	3	Medium	Red	14000000.00	t	t	CBKC	t	Natal, RN	2025-05-07		87ddeda4-5940-409b-900a-2ab2b4a7547b
fddac4ec-8146-464d-83b0-37626f52aba5	SD-0128	Female	2	Large	White	20000000.00	t	t	CBKC	t	Recife, PE	2025-05-07		bf133f2d-7dfd-450f-8b0e-42cad75bcb48
20d3b36b-15fe-42e3-b6cf-cf0c3abe2bb9	WC-1235	Female	2	Medium	Red	16000000.00	t	t	CBKC	t	Maragogi, AL	2025-05-07		93a028a7-ee61-4f99-8afd-cbddbc0e4882
e5b9a9a9-82b7-4e6d-9927-7b2db0bf5bb4	CC-6642	Male	10	Large	Red	24000000.00	t	t	CBKC	t	Ijuí, RS	2025-05-07		df0d779e-740f-427b-9d1b-ab91e61d6559
d3f9b79c-fb7c-4a6b-a8f4-5069ff463c2a	CS-1230	Female	2	Medium	Brown	17500000.00	t	t	CBCK	t	Bento Gonçalves, RS	2025-05-07		b86a5dff-a806-44dd-ade5-18633e97c2f8
64a86994-5338-4475-94b7-4e0d3273cb02	ST-0040	Male	3	Small	Brown & White	6500000.00	t	t	CBKC	t	Caxias do sul, BR	2025-05-02	Lovely	f077c919-9580-4d80-a51b-9f28eca3f1e3
\.


--
-- Data for Name: pet_knowledge; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pet_knowledge (id, title, summary, content, "imageUrl", category, "createdAt", "isActive", breed_id) FROM stdin;
e780de39-5759-42f7-b9ea-0d8a5999b1ce	Meet the Spirited Shiba Inu Puppies: Loyalty, Intelligence, and Balanced Nutrition	Embrace the spirited world of Shiba Inu puppies—admired for their fox-like looks, independent streak, and unwavering loyalty. In this article, you’ll explore breed-specific traits, uncover optimal nutrition tips, discover must-have products for active pups, and learn how to prepare your home for an adventurous companion.	1.\tWhy Choose a Shiba Inu Puppy?\n\nShiba Inu puppies offer a blend of independence and affection, making them ideal for active households that value both playtime and personal space.\n       • Temperament: Alert, confident, and clean.\n       • Intelligence: Quick thinkers; thrive on puzzle challenges.\n       • Energy Level: High—requires daily runs and interactive games.\n\n2.\tTailored Nutrition for Puppies\n\nMedium-breed formulas support their active lifestyle and lean build.\n       • Premium Protein: Fuels muscle tone and sustained energy.\n       • Omega-3 Fatty Acids: Enhance coat shine and joint health.\n       • Essential Minerals: Support bone density and nerve function.\n\nExpert Tip:\nIntroduce gradual diet changes over 7 days when switching to adult food at 12 months, and consider splitting meals into two daily servings for consistent energy.\n3.\tFeatured Products for Complete Care\n       1. Agility Starter Kit – Channels high energy into structured play.\n       2. Reflective Collar & Leash – Safe evening walks and outdoor adventures.\n       3. Dental Health Chews – Encourage healthy gums and teeth.\n       4. Deshedding Brush – Control undercoat shedding during seasonal changes.\n\n4.\tPreparing Your Home for Puppy Arrival\n\n       • Secure Fencing: Ensure backyard perimeters are escape-proof.\n       • Safe Chew Toys: Provide durable options to deter destructive chewing.\n       • Socialization Schedule: Arrange meet-ups with well-behaved dogs.\n\n5.\tConclusion & Call to Action\n\nWelcoming a Shiba Inu puppy means partnering with a bright, energetic friend who will fill your days with adventure. With tailored nutrition, engaging products, and a secure environment, you’ll foster trust and lasting loyalty.\n\n👉 Visit our store today to browse top-quality foods, training gear, and featured items in our Nutrition and Featured categories. Begin your Shiba Inu journey now!	https://cdn.royalcanin-weshare-online.io/uj_I93oBRYZmsWpcIbf4/v5/bp-lot-1-shiba-couleur-outdoor	General	2025-05-09 16:07:39.495571	f	87ddeda4-5940-409b-900a-2ab2b4a7547b
dedb7999-6bfb-4788-a37a-c2cd86ce1c62	Happy Puppy Socialization Guide: Nutrition, Products, and Home Prep	Cultivating a well-socialized puppy early sets the stage for a confident, friendly adult dog. In this article, you’ll discover why socialization matters, learn nutrition guidelines to fuel mental and physical growth, explore our top product picks for interactive learning, and get practical tips to baby-proof and prepare your home for new experiences.	1.\tWhy Choose to Socialize Your Puppy?\n\nEarly socialization reduces anxiety, prevents behavioral issues, and builds trust between you and your pup. A well-exposed puppy grows into a balanced, adaptable dog.\n       • Temperament: Encourages calmness and curiosity.\n       • Intelligence: Boosts confidence in new situations.\n       • Energy Level: Channeled through positive experiences.\n\n2.\tTailored Nutrition for Puppies\n\nBalanced diets support brain development, helping puppies process and learn from social encounters.\n      • High-Quality Protein: Fuels brain and muscle growth.\n      • DHA & EPA: Critical for neural development and focus.\n      • Antioxidants: Promote immune health during high-stress situations.\n\nExpert Tip:\nProvide small, protein-rich training treats during socialization exercises to reinforce positive behavior and build lasting associations.\n\n3.\tFeatured Products for Complete Care\n\n       1. Clicker Training Kit – Precision tool for reward-based learning.\n       2. Treat-Dispensing Toys – Engaging puzzles that reinforce good manners.\n       3. Puppy Playpen – Safe, portable space for supervised exploration.\n       4. Calming Coat – Light compression wrap to ease first-time jitters.\n\n4.\tPreparing Your Home for Puppy Arrival\n\n       • Baby-Proof Setup: Cover outlets, secure cabinets, and hide hazards.\n       • Intro Stations: Create “hello points”—areas for your puppy to meet new people and pets.\n       • Quiet Corner: Designate a retreat with bedding and soft toys for downtime.\n\n5.\tConclusion & Call to Action\n\nInvesting time in early socialization rewards you with a confident, well-mannered companion. Pair positive experiences with balanced nutrition and the right tools to ensure your puppy thrives.\n\n👉 Visit our store today for our full lineup of Nutrition and Featured products designed to support happy, healthy socialization. Start building confidence now!\n	https://www.petropolis.com/wp-content/uploads/Puppy-Socialization-for-Dogs-Health-640x427-1.jpg	Health	2025-05-09 16:10:20.193321	f	\N
727ad35d-a951-45eb-8308-434f9d539ebf	Embrace the Adventure with Siberian Husky Puppies: Energetic, Intelligent, and Nutritionally Supported	Get ready for life in fast-forward—Siberian Husky puppies are bursting with energy, smarts, and striking looks. In this article, you’ll discover why they’re an ideal match for active families, learn targeted nutrition tips to fuel their high drive, explore our curated product picks for endurance and play, and find expert advice to make your home Husky-ready.	1.\tWhy Choose a Siberian Husky Puppy?\n\nHusky puppies are bred for endurance and companionship, thriving in homes that offer plenty of exercise and mental challenges. Their friendly pack mentality makes them great family dogs.\n       • Temperament: Outgoing, playful, and social.\n       • Intelligence: Problem solvers; excel at agility and obedience.\n       • Energy Level: Very high—requires long runs and active play.\n\n2.\tTailored Nutrition for Puppies\n\nPerformance-driven formulas support their muscular build and active lifestyle.\n      • Lean Protein Blend: Fuels sustained energy and muscle repair.\n      • Complex Carbohydrates: Provide slow-burn fuel for endurance.\n      • Joint Support Nutrients: Glucosamine & chondroitin for growing bones.\n\nExpert Tip:\nSplit meals into two daily servings to maintain steady blood sugar and energy levels; consider adding a small amount of fish oil for coat health.\n\n3.\tFeatured Products for Complete Care\n\n       1. Trail-Ready Harness – Built for comfort on long runs.\n       2. Interactive Sled Toy – Simulates natural pulling instincts safely.\n       3. Elevated Cooling Bed – Helps regulate body temperature after exercise.\n       4. High-Protein Training Treats – Reward-driven fuel for learning.\n\n4.\tPreparing Your Home for Puppy Arrival\n\n       • Secure Yards: Husky puppies are escape artists—use tall, secure fencing.\n       • Mental Enrichment: Provide puzzle feeders and obedience challenges.\n       • Climate Considerations: Offer cool, shaded areas indoors during warm seasons.\n\n5.\tConclusion & Call to Action\n\nWelcoming a Siberian Husky puppy means embracing an active, adventure-filled lifestyle. With precise nutrition, durable gear, and a prepared home environment, you’ll set the stage for a lifetime of shared journeys.\n\n👉 Visit our store today to explore our Nutrition and Featured collections—everything you need for an adventurous Husky companion. Start your trek together now!	https://spiritdogtraining.com/wp-content/uploads/2021/02/huskies.jpg	General	2025-05-09 16:30:17.028477	f	e07d2002-78e2-4551-b375-a9aa67f42aff
0585ea52-6154-4287-8115-623222a68ac3	Meet the Charming Golden Retriever Puppies: Beauty, Health, and Balanced Nutrition	Fall in love with the sweetness and charisma of Golden Retriever puppies—known for their intelligence, loyalty, and boundless energy. In this article, you’ll learn about the breed’s standout traits, discover nutrition tips to support healthy growth, and explore our top featured products to keep your new four-legged friend happy and thriving.	1. Why Choose a Golden Retriever?\n\nGolden Retrievers have a special way of winning hearts. Renowned for their gentle, sociable nature, these dogs adapt seamlessly to homes with children, other pets, and both urban and rural environments. Their expressive eyes and soft, golden coat—as seen in the image above—make them a standout choice for any pet lover.\n\t•\tTemperament: Friendly, patient, and highly tolerant.\n\t•\tIntelligence: Easily trainable; masters commands and tricks in just a few sessions.\n\t•\tEnergy Level: Requires daily exercise; loves running, playing fetch, and swimming.\n\n2. Tailored Nutrition for Puppies\n\nProper nutrition is the foundation for strong, happy puppies. Our Nutrition category offers premium kibble formulated specifically for medium-to-large breed puppies like Golden Retrievers.\n\t•\tHigh-Quality Protein: Supports lean muscle development.\n\t•\tOmega-3 & Omega-6 Fatty Acids: Promote a shiny coat and healthy skin.\n\t•\tVitamins & Minerals: Aid in bone growth and immune system support.\n\nExpert Tip:\nFeed puppy-specific kibble until 12 months of age, then transition gradually to adult formula. Offer 3–4 meals per day, following the feeding guidelines on the packaging.\n\n3. Featured Products for Complete Care\n\nIn our Featured section, you’ll find handpicked items to meet every Golden Retriever puppy’s needs:\n\t1.\tInteractive Toys – Channel energy constructively and prevent unwanted behavior.\n\t2.\tErgonomic Beds – Provide extra support for growing bones and joints.\n\t3.\tJoint Supplements – Help guard against common large-breed joint issues.\n\t4.\tGentle Puppy Shampoo – Maintains coat health without stripping natural oils.\n\n4. Preparing Your Home for Puppy Arrival\n\t•\tSafe Space: Set up a dedicated area with bedding, food, and water bowls.\n\t•\tClean Environment: Remove hazards like loose wires or small objects.\n\t•\tEarly Socialization: Introduce your puppy gradually to new people and pets.\n\n5. Conclusion & Call to Action\n\nWelcoming a Golden Retriever puppy into your life means years of joy, loyalty, and fun-filled adventures. By providing balanced nutrition, a secure environment, and the right products, you’ll set the stage for a healthy, happy companion.\n\n👉 Visit our store today to explore top-quality foods, accessories, and featured items in the Nutrition and Featured categories. Begin your golden journey now!\n	https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500	General	2025-05-04 11:43:34.525959	f	163c5d00-8342-4d58-88c9-79e1df39fd37
5b99cb0a-c9b2-436c-bae1-5937de5e1ab4	Discover the Playful Pug Puppies: Charm, Care, and Balanced Diet	Fall for the irresistible charm of Pug puppies—known for their wrinkled faces, loving personalities, and comical antics. In this article, you’ll learn about the breed’s standout traits, uncover nutrition tips tailored to Pug pups, explore our handpicked products for compact companions, and get savvy home-preparation advice to welcome your new friend.	1.\tWhy Choose a Pug Puppy?\nPugs are affectionate, sociable, and a perfect fit for apartment living. Their compact size and gentle nature make them ideal for families and first-time pet owners.\n       • Temperament: Playful, loving, and people-oriented.\n       • Intelligence: Eager to please; responds well to positive reinforcement.\n       • Energy Level: Moderate—enjoys short walks and indoor play.\n\n2.\tTailored Nutrition for Puppies\nSmall breeds like Pugs require calorie-dense, nutrient-balanced diets.\n       • High-Quality Protein: Supports lean muscle without excess calories.\n       • Omega-3 & Omega-6 Fatty Acids: Promote healthy skin and glossy coat.\n       • Calcium & Phosphorus: Aid in proper bone development.\n\nExpert Tip:\nChoose a small-breed puppy formula and feed 4–5 smaller meals per day to maintain steady energy levels and prevent digestive issues.\n\n3.\tFeatured Products for Complete Care\n\n       1. Adjustable Soft Harness – Gentle on the neck, secure fit.\n       2. Puzzle Feeders – Slow down mealtime and stimulate the mind.\n       3. Microfiber Crate Pad – Easy-clean comfort for crate training.\n       4. Wrinkle Cleaning Wipes – Keep facial folds fresh and dry.\n\n4.\tPreparing Your Home for Puppy Arrival\n\n       • Non-Slip Surfaces: Use mats or rugs to prevent joint strain.\n       • Hazard Check: Secure low-lying furniture and remove choking risks.\n       • Intro Routine: Greet new puppy calmly; allow sniffing and exploration.\n\n5.\tConclusion & Call to Action\n\nPug puppies bring endless laughter and cuddles into a home. By providing targeted nutrition, specialized products, and a safe environment, you’ll ensure a smooth transition and lifelong bond.\n\n👉 Visit our store today to shop our Nutrition and Featured sections for the perfect Pug puppy essentials. Bring home the joy of a Pug companion now!	https://i.ytimg.com/vi/FGXdB4oLwrc/maxresdefault.jpg	General	2025-05-09 16:01:24.777945	f	de4c7bd0-2d22-4929-ab00-8f751c22a21f
\.


--
-- Data for Name: store_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_category (id, name, description) FROM stdin;
d660cb7e-7056-46d4-9413-4c1c1d56d461	Dog Food	Premium quality food for dogs
5e64023f-e493-4e6b-b350-3d90a8820b64	Dog toy	Premium quality toy for dogs
d6fbd7b0-2294-4a5b-a9f0-bb1893f57ce9	Dog Bed	A soft and worm bed for your puppy
3918e095-d5ec-4bd1-982d-7d531c70d806	Dog Meds	For the best care to your best friend!
9cddfde8-1383-4e00-bd23-6774cbe1374e	Bowls	For cats or dogs
\.


--
-- Data for Name: store_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_item (id, sku, name, description, price, stock, "categoryId", size) FROM stdin;
5bd32f8d-cc46-424d-9fb3-b852443847b8	DM-0003	Chewable - Canine Aspirin	Provide your large dog with fast and effective relief from minor aches and pains with PetArmor Canine Aspirin 300 mg. Specially formulated for dogs weighing 51 to 120 lbs, these liver-flavored chewable tablets are easy to administer and help manage discomfort caused by inflammation, arthritis, or everyday activities. With 150 tablets per bottle, this over-the-counter supplement offers temporary pain relief while being a convenient and palatable option your pet will love.	275999.00	500	3918e095-d5ec-4bd1-982d-7d531c70d806	250
0d23166f-ec7c-424c-b898-60b6c426b6d1	DF-1236	ProPlan	Balanced food with high quality 15kgs	800000.00	500	d660cb7e-7056-46d4-9413-4c1c1d56d461	15000
7e0cb5c8-1113-470d-af73-1a1b3e297890	DT-0012	Premium dog toy	A toy made of rubber	109000.00	20	5e64023f-e493-4e6b-b350-3d90a8820b64	150
9a7f5ea2-2eb0-4dbf-9af5-e36adbcf3d6e	DF-1043	Kibbles n' bites	A premium dog food with 10,5kg	430000.00	200	d660cb7e-7056-46d4-9413-4c1c1d56d461	10500
c420a32d-5753-496a-909c-58423aec6782	ZD-0023	Zee Dog's beed	The Zee.Bed is the most comfortable dog bed in the world. With viscoelastic foam, a technology developed by NASA, and Ultrasoft anti-scratch microfiber, your dog's naps will never be the same again. Now that's comfort! Also buy the Zee.Dog Bed Cover and complete the set.	500000.00	15	d6fbd7b0-2294-4a5b-a9f0-bb1893f57ce9	200
f93035ad-df42-40d8-bb17-af1b3364bd3b	DF-0001	Premium Dry Dog Food	Balanced nutrition for adult dogs	379000.00	50	d660cb7e-7056-46d4-9413-4c1c1d56d461	10000
c9b4a8ef-b2de-4662-b7c4-cd3d9f0a76b2	DT-1032	Stuffed Dachshund Dog	A soft and cuddly plush dachshund toy wearing a knitted striped sweater and a winter hat with a pom-pom. Perfect as a playful decor item or a comforting companion for children.	350000.00	300	5e64023f-e493-4e6b-b350-3d90a8820b64	140
eddeefe2-f8a5-4fac-9327-85888db2b1a7	DT-2379	Plush Dinosaur Toy	A friendly and fluffy green dinosaur plush toy with soft textures, white belly accents, and embroidered facial details. Perfect for playtime, nursery decor, or as a cuddly bedtime companion.	250000.00	230	5e64023f-e493-4e6b-b350-3d90a8820b64	200
455e4f24-39f0-44d7-b941-0a460004c9f4	DB-0127	Soft Round Dog Bed	A cozy round pet bed made with ultra-soft plush interior and a suede-like exterior. Designed to provide warmth, comfort, and a sense of security for small to medium-sized pets. Ideal for restful naps and everyday lounging.	499999.00	150	d6fbd7b0-2294-4a5b-a9f0-bb1893f57ce9	300
869d6177-e69d-4467-9567-88fc80567912	DF-5632	Hownd - SuperFood	The most complete and balanced food for your best buddy!	675000.00	400	d660cb7e-7056-46d4-9413-4c1c1d56d461	12000
131003c9-6415-47b2-b348-547dcfb0d0a5	DF-4123	BlackHawk - Professional	Chicken & Rice Holistic Adult	330000.00	175	d660cb7e-7056-46d4-9413-4c1c1d56d461	3000
48c37a16-e984-4382-b9a8-b4f5022db8fa	DF-2351	SnackDog - Adulto	Meet and Chicken	475999.00	35	d660cb7e-7056-46d4-9413-4c1c1d56d461	10000
20e3f049-dfc0-4bcf-8e14-5b7bd4a9fe53	BS-0124	Red dog bowl	A red bowl for feed your buddy	135000.00	400	9cddfde8-1383-4e00-bd23-6774cbe1374e	200
\.


--
-- Data for Name: store_item_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_item_image (id, url, "altText", "displayOrder", "itemId") FROM stdin;
63e36efd-b740-42e1-992e-ba691448de83	https://plasvale.cdn.magazord.com.br/img/2023/07/produto/124/brinquedo-pet-de-borracha-osso-135-variacao-89-1-20201202164645.jpeg?ims=fit-in/600x600/filters:fill(white)	A dog toy made with rubber on a bone shape	1	7e0cb5c8-1113-470d-af73-1a1b3e297890
0faa9c6a-d9ee-442f-bd6e-44816188f688	https://d25qvdyh5ydvzo.cloudfront.net/2w0wa81q9hgjo1meo0n50jb2g7ff?width=800&height=800	Zee dog's beed	1	c420a32d-5753-496a-909c-58423aec6782
6bc8cdd1-0e73-4abe-a925-a1f4e0b1216a	https://d25qvdyh5ydvzo.cloudfront.net/ekurl4sqinpk612ujbcwzk32bk23?width=800&height=800	Zee bed	2	c420a32d-5753-496a-909c-58423aec6782
93fbc506-84bb-488d-b2da-75fd5037ce6e	https://d25qvdyh5ydvzo.cloudfront.net/fcab6pjc2skdzuvo0zij5mpd59l5?width=800&height=800	Package	3	c420a32d-5753-496a-909c-58423aec6782
33b848c9-ea71-4052-9794-f03f4cfa9523	https://d25qvdyh5ydvzo.cloudfront.net/gymuardcqrt2ge1t79gsl2xrfzhg?width=800&height=800	Logo	4	c420a32d-5753-496a-909c-58423aec6782
e91b1b13-e94e-4e0f-8ca6-3458e82bb99a	https://d25qvdyh5ydvzo.cloudfront.net/g69s8lzrjfxegi5d8wvq0t2oc6lv?width=800&height=800	Material	5	c420a32d-5753-496a-909c-58423aec6782
8e678b0c-c8e3-4c68-b4a3-dc72bc9074d5	https://www.kibblesnbits.com/wp-content/uploads/2024/04/Kibblesn-Bits-Original-Beef-Chicken-Dry-Dog-Food-3.5LB-1024x1024.png	Dog food	0	9a7f5ea2-2eb0-4dbf-9af5-e36adbcf3d6e
e9cafec7-615e-47c7-8fb0-b5cacc76e0ca	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh-bt4HE981jJbHXmM6OTvhC_V4vY_1h9Xcg&s	dog food	0	0d23166f-ec7c-424c-b898-60b6c426b6d1
c352b224-18ff-4c6c-a2da-c4cab5d4c186	https://m.media-amazon.com/images/I/81+5+4wTfYL._AC_UF1000,1000_QL80_.jpg	10kg of dog food	1	f93035ad-df42-40d8-bb17-af1b3364bd3b
5c329fea-83c9-47f7-bcfb-581b00efa958	https://www.bedbathntable.com.au/media/catalog/product/L/F/LF_Dash_Dog_20734801_SI.jpg?optimize=high&fit=bounds&height=&width=	Stuffed Dachshund Dog	0	c9b4a8ef-b2de-4662-b7c4-cd3d9f0a76b2
cbe8d957-04f4-4dc1-a180-764ff974765d	https://www.dogsandco.com/wp-content/uploads/2022/03/HOP-Big-Foot-Dino.jpeg	Plush Dinosaur Toy	0	eddeefe2-f8a5-4fac-9327-85888db2b1a7
cc395c0e-fa2a-4d4f-aa3e-f19eeedf3505	https://m.media-amazon.com/images/I/816k1+VUl4L.jpg	Soft Round Dog Bed	0	455e4f24-39f0-44d7-b941-0a460004c9f4
33825bb7-b582-488e-a69c-c1c7119a98bf	https://i0.wp.com/lawprintpack.co.uk/wp-content/uploads/2024/01/Hownd.png?resize=800%2C500&ssl=1	Hownd food package with a dog behind	0	869d6177-e69d-4467-9567-88fc80567912
688e555a-5237-4824-9db6-f4cfea81895d	https://5.imimg.com/data5/SELLER/Default/2021/7/UY/SX/YM/19273197/dog-food-packaging-bag.jpg	BlackHawk meal	0	131003c9-6415-47b2-b348-547dcfb0d0a5
1675328b-c21a-4519-b07a-a6c081640bb8	https://images.tcdn.com.br/img/img_prod/1326417/180_racao_snack_dog_premium_para_caes_adultos_21_proteinas_20kg_29_1_23f82cfc1600f1dfeda5224e86c61c6d.png	SnackDog	1	48c37a16-e984-4382-b9a8-b4f5022db8fa
24f93bf5-0cb2-4309-9e85-59b71bd79a2b	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA3rwaTHWRgM1nNc3-0ZojFZT4ro9EOrINng&s	Dog meds	0	5bd32f8d-cc46-424d-9fb3-b852443847b8
cbb94ee8-8e0c-405c-b150-7b3222303097	https://cdn.reddingo.uk/media/mf_webp/jpg/media/catalog/product/cache/c242852b69642886958102ebeb0e83fa/d/b/db-pp-re-wht_1.webp	red bowl	0	20e3f049-dfc0-4bcf-8e14-5b7bd4a9fe53
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role) FROM stdin;
c1b70ea2-2249-4755-8320-311a60b90e27	admin@monito.com	$2b$10$.DhmCnWtUUNg96UgWonjMOuIhCGStvQNwLtsbW4SSN8nvSwZIVKga	admin
aefacdd3-9355-4c2b-8cde-fce32a161538	teste@admin.com	$2b$10$5d3WBmRYeDUetJ7gqLKuh.RfCx8Ch4OPesgxYjK3uaLA4hPV4X0KK	user
\.


--
-- Name: dog PK_187826f37fd8e592a5711350db1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dog
    ADD CONSTRAINT "PK_187826f37fd8e592a5711350db1" PRIMARY KEY (id);


--
-- Name: breed_image PK_24466f5ad55cbee1fcc482a66bd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.breed_image
    ADD CONSTRAINT "PK_24466f5ad55cbee1fcc482a66bd" PRIMARY KEY (id);


--
-- Name: pet_knowledge PK_5262ed8cc33137fad58a25ccb38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pet_knowledge
    ADD CONSTRAINT "PK_5262ed8cc33137fad58a25ccb38" PRIMARY KEY (id);


--
-- Name: store_item_image PK_824ad0844a07e598e51ca07375d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_item_image
    ADD CONSTRAINT "PK_824ad0844a07e598e51ca07375d" PRIMARY KEY (id);


--
-- Name: store_category PK_87379f56e095f996ee141dd7519; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_category
    ADD CONSTRAINT "PK_87379f56e095f996ee141dd7519" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: adoption_photo PK_b555ec32d89b4f6410aa99d728c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adoption_photo
    ADD CONSTRAINT "PK_b555ec32d89b4f6410aa99d728c" PRIMARY KEY (id);


--
-- Name: contacts PK_b99cd40cfd66a99f1571f4f72e6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY (id);


--
-- Name: breed PK_d1c857f060076296ce8a87b9043; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.breed
    ADD CONSTRAINT "PK_d1c857f060076296ce8a87b9043" PRIMARY KEY (id);


--
-- Name: store_item PK_d8d520cf8af78e9dd5bc47943c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_item
    ADD CONSTRAINT "PK_d8d520cf8af78e9dd5bc47943c2" PRIMARY KEY (id);


--
-- Name: dog UQ_0178642319720efe25f3bf5f236; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dog
    ADD CONSTRAINT "UQ_0178642319720efe25f3bf5f236" UNIQUE (sku);


--
-- Name: store_item UQ_738d5654c3bce2ce22ad308cda4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_item
    ADD CONSTRAINT "UQ_738d5654c3bce2ce22ad308cda4" UNIQUE (sku);


--
-- Name: store_category UQ_8a982ccc0928117c954710d7f19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_category
    ADD CONSTRAINT "UQ_8a982ccc0928117c954710d7f19" UNIQUE (name);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: store_item_image FK_0e0a624b4b4c0b13e3aee6b7130; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_item_image
    ADD CONSTRAINT "FK_0e0a624b4b4c0b13e3aee6b7130" FOREIGN KEY ("itemId") REFERENCES public.store_item(id) ON DELETE CASCADE;


--
-- Name: store_item FK_2ad97e4207e07f2d9ed4635ff14; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_item
    ADD CONSTRAINT "FK_2ad97e4207e07f2d9ed4635ff14" FOREIGN KEY ("categoryId") REFERENCES public.store_category(id);


--
-- Name: pet_knowledge FK_3ac950ce06ddab92b2c257cdf2f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pet_knowledge
    ADD CONSTRAINT "FK_3ac950ce06ddab92b2c257cdf2f" FOREIGN KEY (breed_id) REFERENCES public.breed(id);


--
-- Name: adoption_photo FK_ac8233a5eb9460de3d18dffd226; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adoption_photo
    ADD CONSTRAINT "FK_ac8233a5eb9460de3d18dffd226" FOREIGN KEY (breed_id) REFERENCES public.breed(id);


--
-- Name: breed_image FK_bb4680a4501a3b8c3a447d02d60; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.breed_image
    ADD CONSTRAINT "FK_bb4680a4501a3b8c3a447d02d60" FOREIGN KEY ("breedId") REFERENCES public.breed(id) ON DELETE CASCADE;


--
-- Name: dog FK_cde503034bc7b072e3618df9d9d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dog
    ADD CONSTRAINT "FK_cde503034bc7b072e3618df9d9d" FOREIGN KEY ("breedId") REFERENCES public.breed(id);


--
-- PostgreSQL database dump complete
--

