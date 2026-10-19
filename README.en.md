# Kazakhstan's family welfare methodology: an open review

A citizen's submission to Kazakhstan's Ministry of Labour and Social Protection, with **85 points that
need clarification** in the Methodology for Determining the Social Well-Being of a Family (Order No. 267
of 29 June 2023, as amended by Order No. 247 of 17 June 2026). The Digital Family Card uses this
methodology to sort families into categories A to E. Texts checked against the official Adilet
publication as of 17 October 2026.

Interactive map (in Russian): https://rifmj.github.io/kz-family-welfare-review/

Three examples:

- **Clause 13.** Category C is "from −30 to 729 points", category D is "from −460 to −29 points". A
  total of −30 falls into both, however "to" is read; −460 likewise falls into both D and E.
- **Clause 11(1).** A single dwelling of "less than 18 square metres" per person scores −80, "more
  than 18" scores 0; exactly 18 has no score. The Kazakh text says "кем дегенде 18" — "at least 18".
- **Clause 6(3).** One type of agricultural machinery scores 100, "more than two types" scores 200;
  exactly two types have no row.

Under clause 1, the Digital Family Card data "serve as the basis for identifying persons (families)
potentially in need of social protection measures".

Author: Rifat Jumagulov, a citizen of Kazakhstan and the founder and developer of
[Arxo](https://arxo.io). 49 of the 85 points were found while building an executable model of the
methodology in Arxo or confirmed by running it: where two rows match one family's facts, or none does,
the model stops instead of choosing. The rest come from a line-by-line reading of the Russian and Kazakh
texts with the help of language models. The author checked every quotation and figure against the
official Adilet text; every point cites its clause and can be checked without Arxo or AI.

This is an engineering review of published text and hypothetical households. It makes no findings about
the system's actual calculations, benefit payments or the number of affected households.

Materials are in Russian: [obrashchenie.md](obrashchenie.md) (the submission),
[prilozhenie.md](prilozhenie.md) (the 85 points), [primery.md](primery.md) (worked examples),
[PROVERKA.md](PROVERKA.md) (a five-minute check). Licence: [CC BY 4.0](LICENSE).
